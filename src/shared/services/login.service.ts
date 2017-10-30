import * as _ from 'lodash';

import { AuthenticateModel, AuthenticateResultModel, ExternalAuthenticateModel, ExternalAuthenticateResultModel, ExternalLoginProviderInfoModel, PhoneAuthenticateModel, SupplementAuthModel, SupplementAuthResultModel, TokenAuthServiceProxy, WebLogServiceProxy } from '@shared/service-proxies/service-proxies';
import { Headers, Http, Response } from '@angular/http';
import { Injectable, transition } from '@angular/core';
import { Params, Router } from '@angular/router';

import { AppConsts } from '@shared/AppConsts';
import { CookiesService } from 'shared/services/cookies.service';
import { LogService } from '@abp/log/log.service';
import { MessageService } from '@abp/message/message.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { Observable } from 'rxjs/Observable';

const UA = require('ua-device');

export class ExternalLoginProvider extends ExternalLoginProviderInfoModel {

    static readonly WECHAT = 'WeChat';
    static readonly WECHATMP = 'WeChatMP';
    static readonly QQ = 'QQ';
    icon: string;
    initialized = false;

    private static getSocialIcon(providerName: string): string {
        providerName = providerName.toLowerCase();

        return providerName;
    }

    constructor(providerInfo: ExternalLoginProviderInfoModel) {
        super();

        this.name = providerInfo.name;
        this.clientId = providerInfo.clientId;
        this.icon = ExternalLoginProvider.getSocialIcon(this.name);
        this.initialized = (providerInfo.name === 'WeChat' || providerInfo.name === 'QQ');
    }
}

@Injectable()
export class LoginService {
    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';
    outputUa: any;
    throwException: any;
    jsonParseReviver: any;
    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    externalLoginProviders: ExternalLoginProvider[] = [];
    rememberMe: boolean;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _messageService: MessageService,
        private _logService: LogService,
        private _cookiesService: CookiesService
    ) {
        this.clear();
    }

    authenticate(finallyCallback?: () => void, redirectUrl?: string): void {
        finallyCallback = finallyCallback || (() => { });

        // We may switch to localStorage instead of cookies
        this.authenticateModel.twoFactorRememberClientToken = this._cookiesService.getCookieValue(LoginService.twoFactorRememberClientTokenName);

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .finally(finallyCallback)
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result, redirectUrl);
            });
    }

    phoneNumAuth(model: PhoneAuthenticateModel, finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });
        this._tokenAuthService
            .phoneNumAuthenticate(model)
            .finally(finallyCallback)
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result);
            });
    }

    supplRregister(model: SupplementAuthModel, finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });
        this._tokenAuthService
            .supplementAuth(model)
            .finally(finallyCallback)
            .subscribe((result: SupplementAuthResultModel) => {
                this.login(result.tenantId, result.accessToken, result.encryptedAccessToken, result.expireInSeconds, true);
            })
    }

    externalAuthenticate(provider: ExternalLoginProvider): void {
        this.ensureExternalLoginProviderInitialized(provider, () => {
            if (provider.name === ExternalLoginProvider.WECHAT) {
                jQuery.getScript('https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js', () => {
                    const wxLogin = new WxLogin({
                        id: 'external_login_container',
                        appid: provider.clientId,
                        scope: 'snsapi_login',
                        redirect_uri: AppConsts.appBaseUrl + AppConsts.externalLoginUrl + '?providerName=' + ExternalLoginProvider.WECHAT, /*暂用测试域名*/
                        state: 'xiaoyuyue',
                        style: 'black',
                        href: 'https://static.vapps.com.cn/vappszero/wechat-login.css'
                    });
                });
            } else if (provider.name === ExternalLoginProvider.QQ) {
                const authBaseUrl = 'https://graph.qq.com/oauth2.0/authorize';
                const appid = provider.clientId;
                const redirect_url = AppConsts.appBaseUrl + '/auth/external' + '?providerName=' + ExternalLoginProvider.QQ + '&isAuthBind=false';
                const response_type = 'code';
                const scope = 'get_user_info';

                const authUrl = `${authBaseUrl}?client_id=${appid}&response_type=${response_type}&scope=${scope}&redirect_uri=${encodeURIComponent(redirect_url)}&display=`;

                window.location.href = authUrl;
            }
        });
    }

    init(callback?: any): void {
        this.outputUa = new UA(window.navigator.userAgent);
        this.initExternalLoginProviders(callback);
    }

    private processAuthenticateResult(authenticateResult: AuthenticateResultModel, redirectUrl?: string) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.shouldResetPassword) {
            // Password reset

            this._router.navigate(['account/reset-password'], {
                queryParams: {
                    userId: authenticateResult.userId,
                    tenantId: abp.session.tenantId,
                    resetCode: authenticateResult.passwordResetCode
                }
            });

            this.clear();

        } else if (authenticateResult.requiresTwoFactorVerification) {
            // Two factor authentication

            this._router.navigate(['account/send-code']);

        } else if (authenticateResult.accessToken) {
            // Successfully logged in
            this.login(authenticateResult.tenantId, authenticateResult.accessToken, authenticateResult.encryptedAccessToken, authenticateResult.expireInSeconds, this.rememberMe, authenticateResult.twoFactorRememberClientToken, UrlHelper.redirectUrl);

        } else {
            // Unexpected result!

            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['auth/login']);

        }
    }

    private login(tenantId: number, accessToken: string, encryptedAccessToken: string, expireInSeconds: number, rememberMe?: boolean, twoFactorRememberClientToken?: string, redirectUrl?: string): void {
        const tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;

        this._cookiesService.setToken(
            accessToken,
            tokenExpireDate
        );
        this._cookiesService.setTenantIdCookie(tenantId);

        this._cookiesService.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            abp.appPath
        );

        if (twoFactorRememberClientToken) {
            this._cookiesService.setCookieValue(
                LoginService.twoFactorRememberClientTokenName,
                twoFactorRememberClientToken,
                new Date(new Date().getTime() + 365 * 86400000), // 1 year
                abp.appPath
            );
        }

        UrlHelper.redirectUrl = this._cookiesService.getCookieValue('UrlHelper.redirectUrl');
        this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
        const initialUrl = UrlHelper.redirectUrl && UrlHelper.redirectUrl.indexOf(AppConsts.appBaseUrl) >= 0 ? UrlHelper.redirectUrl : UrlHelper.redirectUrl = AppConsts.appBaseUrl + '/dashboard';
        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            location.href = initialUrl;
        }
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }

    private initExternalLoginProviders(callback?: any) {
        if (this.externalLoginProviders.length > 0) {
            if (callback) {
                callback(this.externalLoginProviders);
            }
            return;
        }
        this._tokenAuthService
            .getExternalAuthenticationProviders()
            .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                this.externalLoginProviders = _.map(providers, p => {
                    return new ExternalLoginProvider(p);
                });

                if (callback) {
                    callback(this.externalLoginProviders);
                }
            });
    }

    ensureExternalLoginProviderInitialized(loginProvider: ExternalLoginProvider, callback: () => void) {
        if (loginProvider.initialized) {
            callback();
            return;
        }

        if (loginProvider.name === ExternalLoginProvider.WECHAT) {

        }
    }

    public externalLoginCallback(params: Params): void {
        const model = new ExternalAuthenticateModel();
        model.authProvider = params['providerName'];
        model.providerAccessCode = params['code'];
        model.providerKey = params['code'];
        this._tokenAuthService.externalAuthenticate(model).subscribe((result: ExternalAuthenticateResultModel) => {
            if (result.waitingForActivation) {
                this._messageService.info('您已成功注册,请完善基本信息!');
                // this._router.navigate(['/account/supplementary-external-register', result.userId]);
                return;
            }

            this.login(result.tenantId, result.accessToken, result.encryptedAccessToken, result.expireInSeconds, true);
        });
    }

    public externalBindingCallback(params: Params): void {
        const model = new ExternalAuthenticateModel();
        model.authProvider = params['providerName'];
        model.providerAccessCode = params['code'];
        model.providerKey = params['code'];
        this._tokenAuthService.externalBinding(model)
            // .catch((error: any) => {
            //     UrlHelper.redirectUrl = this._cookiesService.getCookieValue('UrlHelper.redirectUrl');
            //     this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
            //     const initialUrl = UrlHelper.redirectUrl ? UrlHelper.redirectUrl : UrlHelper.redirectUrl = AppConsts.appBaseUrl + '/user/home';
            //     location.href = initialUrl;
            //     return Observable.throw(error);
            // })
            .subscribe(() => {
                UrlHelper.redirectUrl = this._cookiesService.getCookieValue('UrlHelper.redirectUrl');
                this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
                const initialUrl = UrlHelper.redirectUrl ? UrlHelper.redirectUrl : UrlHelper.redirectUrl = AppConsts.appBaseUrl + '/user/home';
                location.href = initialUrl;
            });

    }



    protected processExternalAuthenticate(response: Response): ExternalAuthenticateResultModel {
        const responseText = response.text();
        const status = response.status;

        if (status === 200) {
            let result200: ExternalAuthenticateResultModel = null;
            const resultData200 = responseText === '' ? null : JSON.parse(responseText, this.jsonParseReviver);
            result200 = resultData200 ? ExternalAuthenticateResultModel.fromJS(resultData200) : new ExternalAuthenticateResultModel();
            return result200;
        } else if (status !== 200 && status !== 204) {
            this.throwException('An unexpected server error occurred.', status, responseText);
        }
        return null;
    }
}