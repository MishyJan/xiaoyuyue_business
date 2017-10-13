import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppConsts } from 'shared/AppConsts';
import { CookiesService } from 'shared/services/cookies.service';

@Component({
    selector: 'xiaoyuyue-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss'],
    animations: [accountModuleAnimation()]
})
export class SecurityComponent extends AppComponentBase implements OnInit {
    externalWechatUrl: string;
    linkedWechatText: string;
    isBindingWechat: boolean;
    constructor(
        private injector: Injector,
        private _appSessionService: AppSessionService,
        private _cookiesService: CookiesService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.isBindingWechat = this.checkIsBindWechat()
    }

    linkWechat(): void {
        if (this.isBindingWechat) {
            return;
        }
        this.externalWechatUrl = AppConsts.shareBaseUrl + '/auth/external?authToken=' + this._cookiesService.getToken() + '&isAuthBind=true&redirectUrl=' + encodeURIComponent(document.location.href);
        window.location.href = this.externalWechatUrl;
    }

    checkIsBindWechat(): boolean {
        if (this._appSessionService.user.weChat) {
            this.linkedWechatText = this._appSessionService.user.weChat;
            return true;
        }
        this.linkedWechatText = '未关联';
        return false;
    }
}
