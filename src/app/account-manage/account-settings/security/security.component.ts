import { Component, Injector, OnInit } from '@angular/core';
import { ExternalLoginProvider, LoginService } from 'shared/services/login.service';
import { ExternalUnBindingModel, ProfileServiceProxy, TokenAuthServiceProxy, UserSecurityInfoDto } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss'],
    animations: [accountModuleAnimation()]
})
export class SecurityComponent extends AppComponentBase implements OnInit {
    userSecurityInfo: UserSecurityInfoDto = new UserSecurityInfoDto();
    externalWechatUrl: string;
    linkedWechatText: string;
    linkedQQText: string;
    linkedFaceBookText: string;
    linkedGoogleText: string;
    isBindingQQ: boolean;
    constructor(
        private injector: Injector,
        private _appSessionService: AppSessionService,
        private _cookiesService: CookiesService,
        private _loginService: LoginService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this._loginService.init();
        this.getUserSecurityInfo();
    }

    // 获取当前用户安全信息
    getUserSecurityInfo(): void {
        this._profileServiceProxy
            .getCurrentUserSecurityInfo()
            .subscribe(result => {
                this.userSecurityInfo = result;
                this.linkedWechatText = result.weChat ? result.weChat : this.l('Unrelated');
                this.linkedQQText = result.qq ? result.qq : this.l('Unrelated');
                this.linkedFaceBookText = result.faceBook ? result.faceBook : this.l('Unrelated');
                this.linkedGoogleText = result.google ? result.google : this.l('Unrelated');
            })
    }

    linkWechat(): void {
        if (this.checkIsBindWechat()) {
            this.unBindWeChat();
            return;
        }

        this.externalWechatUrl = AppConsts.userCenterUrl + '/auth/external?authToken=' + this._cookiesService.getToken() + '&isAuthBind=true&redirectUrl=' + encodeURIComponent(document.location.href);
        window.location.href = this.externalWechatUrl;
    }

    linkQQ(): void {
        if (this.checkIsBindQQ()) {
            this.unBindQQ();
            return;
        }
        this.setRedirectUrl();
        this._loginService.externalAuthenticate(this._loginService.findExternalLoginProvider(ExternalLoginProvider.QQ), true);
    }

    linkFacebook(): void {
        if (this.checkIsBindFacebook()) {
            this.unBindFacebook();
            return;
        }
        this.setRedirectUrl();
        this._loginService.externalAuthenticate(this._loginService.findExternalLoginProvider(ExternalLoginProvider.FACEBOOK), true);
    }


    linkGoogle(): void {
        if (this.checkIsBindGoogle()) {
            this.unBindGoogle();
            return;
        }
        this.setRedirectUrl();
        this._loginService.externalAuthenticate(this._loginService.findExternalLoginProvider(ExternalLoginProvider.GOOGLE), true);
    }

    checkIsBindWechat(): boolean {
        if (this.userSecurityInfo.weChat) {
            this.linkedWechatText = this.userSecurityInfo.weChat;
            return true;
        }
        this.linkedWechatText = this.l('Unrelated');
        return false;
    }

    checkIsBindQQ(): boolean {
        if (this.userSecurityInfo.qq) {
            this.linkedQQText = this.userSecurityInfo.qq;
            return true;
        }
        this.linkedWechatText = this.l('Unrelated');
        return false;
    }


    checkIsBindFacebook(): boolean {
        if (this.userSecurityInfo.faceBook) {
            this.linkedFaceBookText = this.userSecurityInfo.faceBook;
            return true;
        }
        this.linkedFaceBookText = this.l('Unrelated');
        return false;
    }

    checkIsBindGoogle(): boolean {
        if (this.userSecurityInfo.google) {
            this.linkedGoogleText = this.userSecurityInfo.google;
            return true;
        }
        this.linkedGoogleText = this.l('Unrelated');
        return false;
    }

    unBindQQ(): void {
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.QQ;
        this.unBind(data);
    }

    // 解绑微信
    unBindWeChat() {
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.WECHAT;
        this.unBind(data);
    }

    unBindGoogle() {
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.GOOGLE;
        this.unBind(data);
    }

    unBindFacebook() {
        const data = new ExternalUnBindingModel();
        data.authProvider = ExternalLoginProvider.FACEBOOK;
        this.unBind(data);
    }

    private setRedirectUrl() {
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1);
        this._cookiesService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
    }

    private unBind(data: ExternalUnBindingModel) {
        this.message.confirm(this.l('UnBinding.Sure'), this.l('UnBinding.Confirm.Message'), (result) => {
            if (!result) { return; }
            this._tokenAuthService.externalUnBinding(data).subscribe(result => {
                this.getUserSecurityInfo();
                this.notify.success(this.l('Unbinding.Success.Hint'));
            });
        })
    }
}
