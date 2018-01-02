import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ExternalUnBindingModel, TokenAuthServiceProxy, UserCodeSendInput } from './../../shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BindingPhoneModelComponent } from './phone-model/binding-phone-model/binding-phone-model.component';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { ExternalBindingModelComponent } from './external-auth/external-binding-model/external-binding-model.component';
import { UnbindingPhoneModelComponent } from './phone-model/unbinding-phone-model/unbinding-phone-model.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { LoginService, ExternalLoginProvider } from 'shared/services/login.service';
import { ExternalLoginProviderInfoModel, ProfileServiceProxy, UserSecurityInfoDto } from '@shared/service-proxies/service-proxies';
import { CookiesService } from 'shared/services/cookies.service';
import { AppConsts } from '@shared/AppConsts';
import { BindingEmailModelComponent } from 'app/account-settings/email-model/binding-email-model/binding-email-model.component';
import { UnbindingEmailModelComponent } from 'app/account-settings/email-model/unbinding-email-model/unbinding-email-model.component';

@Component({
    selector: 'xiaoyuyue-acount-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountSecurityComponent extends AppComponentBase implements OnInit {
    userSecurityInfo: UserSecurityInfoDto = new UserSecurityInfoDto();
    @ViewChild('changePasswdModel') changePasswdModel: ChangePasswdModelComponent;
    @ViewChild('bindingPhoneModel') bindingPhoneModel: BindingPhoneModelComponent;
    @ViewChild('unbindingPhoneModel') unbindingPhoneModel: UnbindingPhoneModelComponent;
    @ViewChild('bindingEmailModel') bindingEmailModel: BindingEmailModelComponent;
    @ViewChild('unbindingEmailModel') unbindingEmailModel: UnbindingEmailModelComponent;
    @ViewChild('externalBindingModel') externalBindingModel: ExternalBindingModelComponent;

    unBinding = false;
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
        this.registerToEvents();
    }

    registerToEvents(): void {
        abp.event.on('getUserSecurityInfo', () => {
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
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1);
        this._cookiesService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
        this.qqExternalAuthRedirect(this._loginService.externalLoginProviders);
    }

    qqExternalAuthRedirect(externalLoginProviders): void {
        for (let i = 0; i < externalLoginProviders.length; i++) {
            if (externalLoginProviders[i].name === 'QQ') {
                const authBaseUrl = 'https://graph.qq.com/oauth2.0/authorize';
                const appid = externalLoginProviders[i].clientId;
                const redirect_url = AppConsts.appBaseUrl + '/auth/external' + '?providerName=' + ExternalLoginProvider.QQ + '&isAuthBind=true';
                const response_type = 'code';
                const scope = 'get_user_info';

                const authUrl = `${authBaseUrl}?client_id=${appid}&response_type=${response_type}&scope=${scope}&redirect_uri=${encodeURIComponent(redirect_url)}&display=`;

                window.location.href = authUrl;
            }
        }
    }

    bindWeChatResult(result) {
        if (result) { this.getUserSecurityInfo(); }
    }

    // 解绑微信
    unBindWeChat() {
        this.unBinding = true;
        const data = new ExternalUnBindingModel();
        data.authProvider = 'WeChat'
        this._tokenAuthService.externalUnBinding(data).subscribe(result => {
            this.getUserSecurityInfo();
            this.notify.success('解绑成功');
        });
    }

    unBindQQ(): void {
        const data = new ExternalUnBindingModel();
        data.authProvider = 'QQ';
        this._tokenAuthService.externalUnBinding(data).subscribe(result => {
            this.getUserSecurityInfo();
            this.notify.success('解绑成功');
        });
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
}
