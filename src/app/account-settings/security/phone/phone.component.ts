import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { VerificationCodeType } from 'shared/AppEnums';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { BindingPhoneNumInput, ChangeBindingPhoneNumInput, CheckUserCodeInput, SMSServiceProxy, ProfileServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'xiaoyuyue-phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.scss'],
    animations: [accountModuleAnimation()]
})
export class PhoneComponent extends AppComponentBase implements OnInit {

    bindingPhoneNumInput: BindingPhoneNumInput = new BindingPhoneNumInput();
    phoneNum: string;
    code: string;
    unbindingCodeType: VerificationCodeType = VerificationCodeType.PhoneUnBinding;
    bindingCodeType: VerificationCodeType = VerificationCodeType.PhoneBinding;

    constructor(
        injector: Injector,
        private _location: Location,
        private _profileServiceProxy: ProfileServiceProxy,
        public sessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    bindPhone(): void {
        this._profileServiceProxy
            .bindingPhoneNum(this.bindingPhoneNumInput)
            .subscribe(() => {
                this.sessionService.init();
                this._location.back();
                setTimeout(() => {
                    this.notify.success(this.l('Binding.Success.Hint'));
                }, 1000);
            });
    }

    unbindPhone(): void {
        this._profileServiceProxy
            .unBindingPhoneNum(this.code)
            .subscribe(() => {
                this.sessionService.init();
                this.notify.success('解绑成功');
            })
    }
}
