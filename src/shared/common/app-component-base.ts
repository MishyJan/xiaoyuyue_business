import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Injector, OnInit } from '@angular/core';

import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';
import { LocalizationService } from '@abp/localization/localization.service';
import { MessageService } from '@abp/message/message.service';
import { Moment } from 'moment';
import { NotifyService } from '@abp/notify/notify.service';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { Permissions } from '@shared/Permissions';
import { SettingService } from '@abp/settings/setting.service';
import { Title } from '@angular/platform-browser';

export abstract class AppComponentBase implements OnInit {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
    commonlocalizationSourceName = AppConsts.localization.CommonLocalizationSourceName;
    permissions = Permissions;
    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    router: Router;
    activatedRoute: ActivatedRoute;
    titleService: Title;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.router = injector.get(Router);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.titleService = injector.get(Title);

        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route) => {
                while (route.firstChild) { route = route.firstChild; }
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .subscribe((event) => {
                this.titleService.setTitle(this.l(event['title']) + ' ' + this.l('Xiaoyuyue'));
            });
    }

    ngOnInit() {
    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (localizedText === key) {
            localizedText = this.localization.localize(key, this.commonlocalizationSourceName);
        }

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }


    t(momentTime: Moment, format: string = 'YYYY-MM-DD HH:mm'): string {
        if (momentTime === undefined) {
            return '';
        }

        const localDatetimeString = momentTime.local().format(format);
        return localDatetimeString;
    }

    omitString(str: string): string {
        return abp.utils.truncateStringWithPostfix(str, 20);
    }
}