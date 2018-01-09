import { AccountServiceProxy, BindingEmailInput, ChangeBindingEmailInput, CheckEmailCodeInput, ProfileServiceProxy, SMSServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { SendCodeType, VerificationCodeType } from 'shared/AppEnums';

import { AppComponentBase } from 'shared/common/app-component-base';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { appModuleAnimation } from 'shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
    animations: [appModuleAnimation()]
})
export class EmailComponent extends AppComponentBase implements OnInit {
    checkEmailCodeInput: CheckEmailCodeInput = new CheckEmailCodeInput();
    bindingEmailInput: BindingEmailInput = new BindingEmailInput();
    sendCodeType: number = SendCodeType.Email;
    bindingEmailCodeType = VerificationCodeType.EmailBinding;
    changeEmailCodeType = VerificationCodeType.ChangeEmail;
    changeBindingEmailInput: ChangeBindingEmailInput = new ChangeBindingEmailInput();
    emailAddress: string;
    encryptEmailAddress: string;
    isVerified = false;
    code: string;
    @ViewChild('smsBtn') smsBtn: ElementRef;

    constructor(
        injector: Injector,
        private _router: Router,
        private _location: Location,
        private _SMSServiceProxy: SMSServiceProxy,
        private _accountServiceProxy: AccountServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getUserPhoneNum();
    }

    verificationEmailAddress(): void {
        this.checkEmailCodeInput.code = this.code;
        this.checkEmailCodeInput.codeType = VerificationCodeType.ChangeEmail;
        this._accountServiceProxy
            .checkEmailCodeByCurrentUser(this.checkEmailCodeInput)
            .subscribe(() => {
                this.isVerified = true;
            })
    }

    changeBindEmail(): void {
        this.changeBindingEmailInput.validCode = this.code;
        this._profileServiceProxy
            .changeBindingEmail(this.changeBindingEmailInput)
            .subscribe(() => {
                this._location.back();
                setTimeout(() => {
                    this.notify.success(this.l('ChangeBingingSuccess'));
                }, 1000);
            });
    }

    bindEmailAddress(): void {
        this.bindingEmailInput.code = this.code;
        this._profileServiceProxy
            .bindingEmailAddress(this.bindingEmailInput)
            .subscribe(() => {
                this._location.back();
                setTimeout(() => {
                    this.notify.success(this.l('BingingSuccess'));
                }, 1000);
            });
    }

    getUserPhoneNum(): void {
        this._profileServiceProxy
            .getCurrentUserSecurityInfo()
            .subscribe(result => {
                this.emailAddress = result.emailAddress;
                this.emailAddressEncrypt();
            })
    }


    private emailAddressEncrypt(): void {
        if (!this.emailAddress) {
            return;
        }
        this.encryptEmailAddress = '•••••••' + this.emailAddress.substr(this.emailAddress.length - 11);
    }
}
