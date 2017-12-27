import * as _ from 'lodash';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { AfterViewInit, Component, Injector, OnInit, transition } from '@angular/core';
import { ExternalLoginProvider, LoginService } from 'shared/services/login.service';
import { ExternalLoginProviderInfoModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { UrlHelper } from 'shared/helpers/UrlHelper';

@Component({
    selector: 'xiaoyuyue-loading',
    templateUrl: './external-auth.component.html',
    styleUrls: ['./external-auth.component.scss']
})
export class ExternalAuthComponent extends AppComponentBase implements OnInit, AfterViewInit {
    isAuthBind = 'false';
    constructor(
        injector: Injector,
        private _router: Router,
        private _loginService: LoginService,
        private _activatedRoute: ActivatedRoute,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _cookiesService: CookiesService,
        private _sessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        this.externalLogin();
    }

    externalLogin(): void {
        const self = this;
        this._activatedRoute.queryParams.subscribe((params: Params) => {
            if (params['redirectUrl'] !== undefined) {
                this._cookiesService.setCookieValue('UrlHelper.redirectUrl', params['redirectUrl'], null, '/');
            }

            if (params['authToken'] !== undefined) {
                this._cookiesService.setToken(params['authToken']);
            }

            if (params['isAuthBind'] !== undefined) {
                self.isAuthBind = params['isAuthBind'];
            }

            if (self.isAuthBind !== 'true') { this.isLogin(); }

            if (params['providerName'] !== undefined) {
                if (self.isAuthBind === 'true') {
                    this._loginService.externalBindingCallback(params);
                } else {
                    this._loginService.externalLoginCallback(params);
                }
            } else {
                this._loginService.init((externalLoginProviders) => {
                    if (this.isWeiXin) {
                        this.weChatExternalAuthRedirect(externalLoginProviders);
                    }
                });
            }
        });
    }

    weChatExternalAuthRedirect(externalLoginProviders) {
        for (let i = 0; i < externalLoginProviders.length; i++) {
            if (externalLoginProviders[i].name === 'WeChatMP') {
                const authBaseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
                const appid = externalLoginProviders[i].clientId;
                const redirect_url = AppConsts.userCenterUrl + '/auth/external' + '?providerName=' + ExternalLoginProvider.WECHATMP + '&isAuthBind=' + this.isAuthBind;
                const response_type = 'code';
                const scope = 'snsapi_userinfo';

                const authUrl = `${authBaseUrl}?appid=${appid}&redirect_uri=${encodeURIComponent(redirect_url)}&response_type=${response_type}&scope=${scope}#wechat_redirect`;
                window.location.href = authUrl;
            }
        }
    }

    // 如果已登录 直接跳转
    isLogin() {
        if (!this._sessionService.user) { return; }
        UrlHelper.redirectUrl = this._cookiesService.getCookieValue('UrlHelper.redirectUrl');
        this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
        const initialUrl = UrlHelper.redirectUrl ? UrlHelper.redirectUrl : UrlHelper.redirectUrl = AppConsts.appBaseUrl + '/user/home';
        location.href = initialUrl;
    }
}
