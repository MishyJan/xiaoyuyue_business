import { AccountServiceProxy, BindingEmailInput, CheckEmailCodeInput, ProfileServiceProxy, SMSServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { SendCodeType, VerificationCodeType } from 'shared/AppEnums';

import { AppComponentBase } from 'shared/common/app-component-base';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { appModuleAnimation } from 'shared/animations/routerTransition';
import { AppSessionService } from 'shared/common/session/app-session.service';

@Component({
    selector: 'xiaoyuyue-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
    animations: [appModuleAnimation()]
})
export class EmailComponent extends AppComponentBase implements OnInit {
    bindingEmailInput: BindingEmailInput = new BindingEmailInput();
    sendCodeType: number = SendCodeType.Email;
    bindingEmailCodeType = VerificationCodeType.EmailBinding;
    unbindingEmailCodeType = VerificationCodeType.EmailUnbinding;
    code: string;
    emailAddress: string;

    constructor(
        injector: Injector,
        private _router: Router,
        private _location: Location,
        private _profileServiceProxy: ProfileServiceProxy,
        public sessionService: AppSessionService
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    bindEmailAddress(): void {
        this._profileServiceProxy
            .bindingEmailAddress(this.bindingEmailInput)
            .subscribe(() => {
                this.sessionService.init();
                this._location.back();
                setTimeout(() => {
                    this.notify.success(this.l('BingingSuccess'));
                }, 1000);
            });
    }

    unBindEmailAddress(): void {
        this._profileServiceProxy
            .unBindingEmailAddress(this.code)
            .subscribe(() => {
                this.sessionService.init();
                this.notify.success('解绑成功');
            })
    }
}
