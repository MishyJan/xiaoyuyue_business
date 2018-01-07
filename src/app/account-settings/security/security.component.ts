import { Component, Injector, OnInit } from '@angular/core';
import { ExternalUnBindingModel, ProfileServiceProxy, TokenAuthServiceProxy, UserSecurityInfoDto } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { LoginService } from 'shared/services/login.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss'],
    animations: [accountModuleAnimation()]
})
export class SecurityComponent extends AppComponentBase implements OnInit {
    linkedQQText: string;
    userSecurityInfo: UserSecurityInfoDto = new UserSecurityInfoDto();
    externalWechatUrl: string;
    linkedWechatText: string;
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
            })
    }

    linkWechat(): void {
        if (this.checkIsBindWechat()) {
            this.unBindWeChat();
            return;
        }
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1);
        this._cookiesService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
        this.externalWechatUrl = AppConsts.userCenterUrl + '/auth/external?authToken=' + this._cookiesService.getToken() + '&isAuthBind=true&redirectUrl=' + encodeURIComponent(document.location.href);
        window.location.href = this.externalWechatUrl;
    }

    linkQQ(): void {
        if (this.checkIsBindQQ()) {
            this.unBindQQ();
            return;
        }
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1);
        this._cookiesService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
        this.qqExternalAuthRedirect(this._loginService.externalLoginProviders);
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

    unBindQQ(): void {
        const data = new ExternalUnBindingModel();
        data.authProvider = 'QQ';
        this._tokenAuthService.externalUnBinding(data).subscribe(result => {
            this.getUserSecurityInfo();
            this.notify.success(this.l('Unbinding.Success.Hint'));
        });
    }

    // 解绑微信
    unBindWeChat() {
        const data = new ExternalUnBindingModel();
        data.authProvider = 'WeChat'
        this._tokenAuthService.externalUnBinding(data).subscribe(result => {
            this.getUserSecurityInfo();
            this.notify.success(this.l('Unbinding.Success.Hint'));
        });
    }

    qqExternalAuthRedirect(externalLoginProviders): void {
        for (let i = 0; i < externalLoginProviders.length; i++) {
            if (externalLoginProviders[i].name === 'QQ') {
                const authBaseUrl = 'https://graph.qq.com/oauth2.0/authorize';
                const appid = externalLoginProviders[i].clientId;
                const redirect_url = AppConsts.appBaseUrl + '/auth/external' + '?providerName=' + externalLoginProviders[i].name + '&isAuthBind=true';
                const response_type = 'code';
                const scope = 'get_user_info';

                const authUrl = `${authBaseUrl}?client_id=${appid}&response_type=${response_type}&scope=${scope}&redirect_uri=${encodeURIComponent(redirect_url)}&display=`;

                window.location.href = authUrl;
            }
        }
    }
}
