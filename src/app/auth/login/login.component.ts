import * as _ from 'lodash';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Injector, OnInit, Output, ViewChild, ViewEncapsulation, transition } from '@angular/core';
import { AuthenticateModel, AuthenticateResultModel, ExternalLoginProviderInfoModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CodeSendInput, PhoneAuthenticateModel, SMSServiceProxy } from 'shared/service-proxies/service-proxies';
import { ExternalLoginProvider, LoginService } from 'shared/services/login.service';
import { Headers, Http } from '@angular/http';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { Location } from '@angular/common';
import { TooltipConfig } from 'ngx-bootstrap';
import { VerificationCodeType } from 'shared/AppEnums';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()],
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent extends AppComponentBase implements OnInit, AfterViewInit {
    externalLoginProviders: ExternalLoginProvider[];
    submitting = false;
    // 普通登录或者手机验证登录，默认普通登录
    ordinaryLogin = true;
    isSendSMS = false;
    saving = false;
    codeType = VerificationCodeType.Login;
    model: PhoneAuthenticateModel = new PhoneAuthenticateModel();
    @ViewChild('smsBtn') _smsBtn: ElementRef;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _location: Location,
        private _activatedRoute: ActivatedRoute,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _SMSServiceProxy: SMSServiceProxy,
    ) {
        super(injector);
        loginService.rememberMe = true;
    }

    ngOnInit(): void {
        if (this.appSession.user) {
            this._router.navigate(['/dashboard']);
        }

        if (this.isWeiXin()) {
            if (this.isWeiXin()) {
                this.loginService.init(() => {
                    this.loginService.externalAuthenticate(this.loginService.findExternalLoginProvider(ExternalLoginProvider.WECHATMP))
                });
            }

            this._router.navigate(['/auth/external']);
        }
    }

    ngAfterViewInit(): void {
        const self = this;
        $(document).click(() => {
            $('#externalLogin').removeClass('active');
            $('#externalLoginContainer').removeClass('active');
        })
    }

    get multiTenancySideIsTeanant(): boolean {
        return this.appSession.tenantId > 0;
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this.appSession.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }

    login(): void {
        if (!this.loginService.authenticateModel.loginCertificate || !this.loginService.authenticateModel.password) {
            this.message.error(this.l('UserNameOrPasswdCannotForNull'), this.l('CannotLogin'));
            return;
        }

        // TODO: 手机验证登录，浏览器存储cookies
        this.saving = true;
        if (!this.ordinaryLogin) {
            this.loginService.phoneNumAuth(this.model, () => this.saving = false);
            return;
        }

        this.loginService.authenticate(
            () => this.saving = false
        );
    }

    externalLogin(provider: ExternalLoginProvider, $event: Event) {
        $event.stopPropagation();
        this.loginService.externalAuthenticate(provider); // 执行第三方登陆逻辑

        if (provider.name === 'WeChat') {
            // 由于每次点击都回去请求微信，但是微信图片隐藏时没必要也去请求
            this.animationShow();
        } else {
            this.animationHide();
        }
    }

    // NgxAni动画
    private animationShow() {
        $('#externalLogin').addClass('active');
        setTimeout(() => {
            $('#externalLoginContainer').addClass('active');
        }, 10);
    }

    private animationHide() {
        $('#externalLogin').removeClass('active');
        $('#externalLoginContainer').removeClass('active');
    }

    // 是否账号登录
    isOrdinaryLogin() {
        this.ordinaryLogin = true;
    }
    // 是否手机验证登录
    isPhoneLogin() {
        this.ordinaryLogin = false;
        // this.ordinaryLogin = true;
    }

    mobileExternalLogin(provider: ExternalLoginProvider): void {
        this.loginService.externalAuthenticate(provider);
    }

    checkInputAutofill(): boolean {
        return $('input:-webkit-autofill').length === 2 ? false : true;
    }
}