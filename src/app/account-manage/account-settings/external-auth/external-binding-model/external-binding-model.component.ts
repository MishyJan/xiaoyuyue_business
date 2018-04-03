import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ProfileServiceProxy, TokenAuthServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { ExternalLoginProvider } from 'shared/services/login.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'xiaoyuyue-external-binding-model',
    templateUrl: './external-binding-model.component.html',
    styleUrls: ['./external-binding-model.component.scss']
})
export class ExternalBindingModelComponent extends AppComponentBase implements OnInit {

    title: string;
    slogen: string;
    externalUrl: string;
    checkTimer: NodeJS.Timer;

    @ViewChild('externalBindingModel') model: ModalDirective;
    @Output() weChatBindRsult: EventEmitter<boolean> = new EventEmitter();
    constructor(
        private injector: Injector,
        private _appSessionService: AppSessionService,
        private _cookiesService: CookiesService,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {

    }

    show(provideName): void {
        this.title = this.l('Binding') + this.l(provideName)
        this.slogen = this.l('BindingSlogen', this.l(provideName));
        this._tokenAuthService.getShortAuthToken().subscribe((result) => {

            this.externalUrl = AppConsts.userCenterUrl + '/auth/external?shortAuthToken=' + result.shortAuthToken + '&isAuthBind=true&providerName=' + ExternalLoginProvider.WECHATMP + '&redirectUrl=' + encodeURIComponent(document.location.href + '/security');

            this.model.show();
            this.checkIsBind();
        });
    }

    close(): void {
        clearInterval(this.checkTimer);
        this.model.hide();
    }

    checkIsBind() {
        this.checkTimer = setInterval(() => {
            this._profileServiceProxy
                .getCurrentUserSecurityInfo()
                .subscribe(result => {
                    if (result.weChat) {
                        this.weChatBindRsult.emit(true);
                        this.close();
                    }
                })
        }, 1000);
    }
}
