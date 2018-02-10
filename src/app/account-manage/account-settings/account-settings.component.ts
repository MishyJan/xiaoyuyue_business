import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ExternalLoginProvider, LoginService } from 'shared/services/login.service';
import { ExternalLoginProviderInfoModel, ExternalUnBindingModel, ProfileServiceProxy, TokenAuthServiceProxy, UserSecurityInfoDto } from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BindingEmailModelComponent } from 'app/account-manage/account-settings/email-model/binding-email-model/binding-email-model.component';
import { BindingPhoneModelComponent } from './phone-model/binding-phone-model/binding-phone-model.component';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { CookiesService } from 'shared/services/cookies.service';
import { ExternalBindingModelComponent } from './external-auth/external-binding-model/external-binding-model.component';
import { UnbindingEmailModelComponent } from 'app/account-manage/account-settings/email-model/unbinding-email-model/unbinding-email-model.component';
import { UnbindingPhoneModelComponent } from './phone-model/unbinding-phone-model/unbinding-phone-model.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-acount-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountSecurityComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    userSecurityInfo: UserSecurityInfoDto = new UserSecurityInfoDto();
    @ViewChild('changePasswdModel') changePasswdModel: ChangePasswdModelComponent;
    @ViewChild('bindingPhoneModel') bindingPhoneModel: BindingPhoneModelComponent;
    @ViewChild('unbindingPhoneModel') unbindingPhoneModel: UnbindingPhoneModelComponent;
    @ViewChild('bindingEmailModel') bindingEmailModel: BindingEmailModelComponent;
    @ViewChild('unbindingEmailModel') unbindingEmailModel: UnbindingEmailModelComponent;
    @ViewChild('externalBindingModel') externalBindingModel: ExternalBindingModelComponent;

    unBindingWechat = false;
    unBindingQQ = false;
    unBindingFB = false;
    unBindingGoogle = false;
    constructor(
        private injector: Injector,
        private _appSessionService: AppSessionService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _loginService: LoginService,
        private _cookiesService: CookiesService,
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this._loginService.init();
        this.getUserSecurityInfo();
    }

    ngAfterViewInit() {
        this.registerToEvents();
    }

    ngOnDestroy() {
        this.unRegisterToEvents();
    }

    registerToEvents(): void {
        abp.event.on('getUserSecurityInfo', () => {
            this.getUserSecurityInfo();
        });

        abp.event.on('facebookBinding', () => {
            this.getUserSecurityInfo();
        });

        abp.event.on('googleBinding', () => {
            this.notify.success(this.l('BingingSuccess'));
            this.getUserSecurityInfo();
        });
    }

    unRegisterToEvents(): void {
        abp.event.off('getUserSecurityInfo', () => {
            this.getUserSecurityInfo();
        });

        abp.event.off('facebookBinding', () => {
            this.notify.success(this.l('BingingSuccess'));
            this.getUserSecurityInfo();
        });

        abp.event.off('googleBinding', () => {
            this.notify.success(this.l('BingingSuccess'));
            this.getUserSecurityInfo();
        });
    }

    // 获取当前用户安全信息
    getUserSecurityInfo(): void {
        this._profileServiceProxy
            .getCurrentUserSecurityInfo()
            .subscribe(result => {
                this.userSecurityInfo = result;
            })
    }

    bindWeChat() {
        this.externalBindingModel.show('WeChat');
    }

    bingQQ(): void {
        this.setRedirectUrl();

        this._loginService.externalAuthenticate(this._loginService.findExternalLoginProvider(ExternalLoginProvider.QQ), true);
    }

    bingFb(): void {
        this._loginService.externalAuthenticate(this._loginService.findExternalLoginProvider(ExternalLoginProvider.FACEBOOK), true);
    }

    bingGoogle(): void {
        this._loginService.externalAuthenticate(this._loginService.findExternalLoginProvider(ExternalLoginProvider.GOOGLE), true);
    }

    bindWeChatResult(result) {
        if (result) { this.getUserSecurityInfo(); }
    }

    // 解绑微信
    unBindWeChat() {
        this.unBindingWechat = true;
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.WECHAT;
        this.unBind(data);
    }

    unBindQQ(): void {
        this.unBindingQQ = true;
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.QQ;
        this.unBind(data);
    }

    unBindFB(): void {
        this.unBindingFB = true;
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.FACEBOOK;
        this.unBind(data);
    }

    unBindGoogle(): void {
        this.unBindingGoogle = true;
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.GOOGLE;
        this.unBind(data);
    }

    private unBind(data) {
        this.message.confirm(this.l('UnBinding.Sure'), this.l('UnBinding.Confirm.Message'), (result) => {
            if (!result) { return; }
            this._tokenAuthService.externalUnBinding(data)
                .finally(() => {
                    this.unBindingWechat = false;
                    this.unBindingQQ = false;
                    this.unBindingFB = false;
                    this.unBindingGoogle = false;
                })
                .subscribe(() => {
                    this.getUserSecurityInfo();
                    this.notify.success(this.l('UnbindingSuccess'));
                });
        })
    }

    showChangePasswdModel(): void {
        this.changePasswdModel.show();
    }

    showChangePhoneModel(): void {
        this.unbindingPhoneModel.show();
    }

    showBindingPhoneModel(): void {
        this.bindingPhoneModel.show();
    }

    showChangeEmailModel(): void {
        this.unbindingEmailModel.show();
    }

    showBindingEmailModel(): void {
        this.bindingEmailModel.show();
    }

    private setRedirectUrl() {
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1);
        this._cookiesService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
    }
}
