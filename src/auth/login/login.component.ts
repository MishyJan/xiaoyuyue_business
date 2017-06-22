import { Component, Injector, OnInit, AfterViewInit, Output, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { TokenAuthServiceProxy, AuthenticateModel, AuthenticateResultModel, ExternalLoginProviderInfoModel } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { LoginService, ExternalLoginProvider } from "shared/services/login.service";
import { TooltipConfig } from "ngx-bootstrap";
import { NgxAni } from "ngxani";
import * as _ from 'lodash';

@Component({
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()],
    styleUrls: ['./login.component.scss'],
    providers: [{ provide: TooltipConfig, useFactory: getAlertConfig }]
})
export class LoginComponent extends AppComponentBase implements AfterViewInit {
    externalLoginProviders: ExternalLoginProvider[];

    submitting: boolean = false;
    flag: boolean = true;
    // 普通登录或者手机验证登录，默认普通登录
    ordinaryLogin: boolean = true;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _location: Location,
        private _activatedRoute: ActivatedRoute,
        private _sessionService: AbpSessionService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _ngxAni: NgxAni
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // this._activatedRoute.queryParams.subscribe((params: Params) => {
        //     this.loginService.externalLoginCallback(params);
        // });

        if (this.is_weixn()) {
            this._tokenAuthService
                .getExternalAuthenticationProviders()
                .subscribe((providers: ExternalLoginProviderInfoModel[]) => {
                    this.externalLoginProviders = _.map(providers, p => {
                        return new ExternalLoginProvider(p);
                    });

                    console.log(this.externalLoginProviders);
                    for (let i = 0; i <this.externalLoginProviders.length; i++) {
                        if (this.externalLoginProviders[i].name == "WeChatMP") {
                            let authBaseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize";
                            let appid = this.externalLoginProviders[i].clientId;
                            let redirect_url = AppConsts.appBaseUrl + '/auth/login'+ '?providerName=' + ExternalLoginProvider.WECHAT;
                            let response_type = "code";
                            let scope = "snsapi_userinfo";

                            let authUrl = `${authBaseUrl}?appid=${appid}&redirect_uri=${encodeURI(redirect_url)}&response_type=${response_type}&scope=${scope}#wechat_redirect`;
                            console.log(redirect_url);
                            window.location.href  = authUrl;
                        }
                    }
                });
        }
    }

    ngAfterViewInit(): void {
        let self = this;
        // 解决Chrome浏览器自动填充的BUG
        setTimeout(() => {
            $("input:-webkit-autofill").addClass("edited")
        }, 300);

        $(document).click(() => {
            self.flag = true;
            $("#externalLogin").css({
                opacity: 0,
                transform: "scale(0)"
            });
            $("#external_login_container").css({
                opacity: 0
            });
        })
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }


    login(): void {
        if (!this.loginService.authenticateModel.loginCertificate || !this.loginService.authenticateModel.password) {
            this.message.error(this.l('UserNameOrPasswdCannotForNull'), this.l('CannotLogin'));
            return;
        }

        this.submitting = true;
        this.loginService.authenticate(
            () => this.submitting = false
        );
    }

    is_weixn() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) + "" == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    externalLogin(provider: ExternalLoginProvider, elementRef: object, externalContent: object, $event) {
        $event.cancelBubble = true;
        this.flag && this.loginService.externalAuthenticate(provider); //执行第三方登陆逻辑

        if (provider.name == 'WeChat' && this.flag) {
            // 由于每次点击都回去请求微信，但是微信图片隐藏时没必要也去请求
            this.animationShow(elementRef, externalContent);
        } else {
            this.animationHide(elementRef, externalContent);
        }
        this.flag = !this.flag;
    }

    // NgxAni动画
    private animationShow(externalAni, externalContent) {
        this._ngxAni.to(externalAni, .6, {
            transform: "scale(1)",
            opacity: .8,
            "ease": this._ngxAni['easeOutBack'],
            onComplete: () => {
                // 利用定时器解决每次请求微信图片会出现延迟，导致显示问题
                setTimeout(() => {
                    this._ngxAni.to(externalContent, 1, {
                        opacity: 1
                    })
                }, 10);
            }
        });
    }


    private animationHide(externalAni, externalContent) {
        console.log(externalAni);
        this._ngxAni.to(externalAni, .4, {
            transform: "scale(0)",
            opacity: 0,
        });
        this._ngxAni.to(externalContent, 1, {
            opacity: 0
        })
    }

    // add after
    //是否账号登录
    isOrdinaryLogin() {
        this.ordinaryLogin = true;
    }
    //是否手机验证登录
    isPhoneLogin() {
        this.ordinaryLogin = false;
    }

}


export function getAlertConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), {
        placement: 'top',
        container: 'body'
    });

}