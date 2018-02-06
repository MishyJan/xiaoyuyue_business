import * as _ from 'lodash';

import { CompilerOptions, NgModuleRef, Type } from '@angular/core';

import { AppConfig } from 'shared/AppConfig';
import { AppConsts, GetCurrentFeatures } from '@shared/AppConsts';
import { CookiesService } from 'shared/services/cookies.service';
import { LocalizedResourcesHelper } from './shared/helpers/LocalizedResourcesHelper';
import { Moment } from 'moment';
import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';
import { UrlHelper } from './shared/helpers/UrlHelper';
import { UtilsService } from '@abp/utils/utils.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

declare var $: any;
export class AppPreBootstrap {
    static cookiesService = new CookiesService();
    static run(callback: () => void): void {
        $.material.init();
        // $('select option:selected').css({
        //     'background': '#FF9641'
        // })
        AppPreBootstrap.getApplicationConfig(() => {
            const queryStringObj = UrlHelper.getQueryParameters();

            if (queryStringObj.impersonationToken) {
                AppPreBootstrap.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback); });
            } else if (queryStringObj.switchAccountToken) {
                AppPreBootstrap.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback); });
            } else {
                AppPreBootstrap.getUserConfiguration(callback);
            }
        });
    }

    static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
        return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
    }

    private static getApplicationConfig(callback: () => void) {
        const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
        const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(AppConfig.AppBaseUrl);

        AppConsts.appBaseUrlFormat = AppConfig.AppBaseUrl;
        AppConsts.userCenterUrl = AppConfig.UserCenterUrl;
        AppConsts.remoteServiceBaseUrlFormat = AppConfig.RemoteServiceBaseUrl;

        if (tenancyName == null) {
            AppConsts.appBaseUrl = AppConfig.AppBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
            AppConsts.remoteServiceBaseUrl = AppConfig.RemoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
        } else {
            AppConsts.appBaseUrl = AppConfig.AppBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
            AppConsts.remoteServiceBaseUrl = AppConfig.RemoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
        }

        callback();
    }

    private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    private static impersonatedAuthenticate(impersonationToken: string, tenantId: number, callback: () => void): JQueryPromise<any> {
        this.cookiesService.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
        return abp.ajax({
            url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=' + impersonationToken,
            method: 'POST',
            headers: {
                '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
                'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
            }
        }).done(result => {
            this.cookiesService.setToken(result.accessToken);
            AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
            location.search = '';
            callback();
        });
    }

    private static linkedAccountAuthenticate(switchAccountToken: string, tenantId: number, callback: () => void): JQueryPromise<any> {
        this.cookiesService.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
        return abp.ajax({
            url: AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=' + switchAccountToken,
            method: 'POST',
            headers: {
                '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
                'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
            }
        }).done(result => {
            this.cookiesService.setToken(result.accessToken);
            AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
            location.search = '';
            callback();
        });
    }

    private static getUserConfiguration(callback: () => void): JQueryPromise<any> {
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
        const data = {
            sourcename: AppConsts.localization.defaultLocalizationSourceName
        };
        return abp.ajax({
            url: AppConsts.remoteServiceBaseUrl + '/api/UserConfiguration/GetAll',
            method: 'GET',
            data: data,
            headers: {
                Authorization: 'Bearer ' + abp.auth.getToken(),
                'AspNetCoreCulture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue), // 处理nginx转发header丢失问题
                '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
                'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
            }
        }).done(result => {
            GetCurrentFeatures.AllFeatures = result.features.allFeatures;
            $.extend(true, abp, result);

            abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);

            moment.locale(abp.localization.currentLanguage.name);
            (window as any).moment.locale(abp.localization.currentLanguage.name);
            if (abp.clock.provider.supportsMultipleTimezone) {
                moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
                // (window as any).moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
            }
            abp.event.trigger('abp.dynamicScriptsInitialized');

            LocalizedResourcesHelper.loadResources(callback);
        });
    }

    private static setEncryptedTokenCookie(encryptedToken: string) {
        new CookiesService().setCookieValue(AppConsts.authorization.encrptedAuthTokenName,
            encryptedToken,
            new Date(new Date().getTime() + 365 * 86400000), // 1 year
            abp.appPath
        );
    }
}