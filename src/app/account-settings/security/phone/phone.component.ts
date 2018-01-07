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
    isVerified = false;
    currentPhoneNum: string;
    encryptPhoneNum: string;
    code: string;
    changeBindingPhoneNumInput: ChangeBindingPhoneNumInput = new ChangeBindingPhoneNumInput();
    checkUserCodeInput: CheckUserCodeInput = new CheckUserCodeInput();
    unbindingCodeType: VerificationCodeType = VerificationCodeType.PhoneUnBinding;
    bindingCodeType: VerificationCodeType = VerificationCodeType.PhoneBinding;
    @ViewChild('smsBtn') smsBtn: ElementRef;

    constructor(
        injector: Injector,
        private _location: Location,
        private _SMSServiceProxy: SMSServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy,
        private _sessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getUserPhoneNum();
    }

    verificationPhoneNum(): void {
        this.checkUserCodeInput.code = this.code;
        this.checkUserCodeInput.codeType = VerificationCodeType.PhoneUnBinding;
        this._SMSServiceProxy
            .checkCodeByCurrentUser(this.checkUserCodeInput)
            .subscribe(() => {
                this.isVerified = true;
            })
    }

    changeBindPhone(): void {
        this.changeBindingPhoneNumInput.validCode = this.code;
        this._profileServiceProxy
            .changeBindingPhoneNum(this.changeBindingPhoneNumInput)
            .subscribe(() => {
                this._location.back();
                setTimeout(() => {
                    this.notify.success(this.l('ChangeBinding.Success.Hint'));
                }, 1000);
            });
    }

    bindPhone(): void {
        this.changeBindingPhoneNumInput.validCode = this.code;
        this._profileServiceProxy
            .bindingPhoneNum(this.bindingPhoneNumInput)
            .subscribe(() => {
                this._location.back();
                setTimeout(() => {
                    this.notify.success(this.l('Binding.Success.Hint'));
                }, 1000);
            });
    }

    getUserPhoneNum(): void {
        this.currentPhoneNum = this._sessionService.user.phoneNumber;
        this.encrypt();
    }

    private encrypt(): void {
        if (!this.currentPhoneNum) {
            return;
        }
        this.encryptPhoneNum = '•••••••' + this.currentPhoneNum.substr(this.currentPhoneNum.length - 4);
    }
}
