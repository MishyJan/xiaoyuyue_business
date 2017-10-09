import { Component, OnInit, Injector, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VerificationCodeType } from 'shared/AppEnums';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BindingPhoneNumInput, ChangeBindingPhoneNumInput, CheckUserCodeInput, CodeSendInput, ProfileServiceProxy, SMSServiceProxy } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.scss'],
    animations: [accountModuleAnimation()]
})
export class PhoneComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _router: Router,
        private _location: Location,
        private _SMSServiceProxy: SMSServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
    }

    bindingPhoneNumInput: BindingPhoneNumInput = new BindingPhoneNumInput();
    time: number = 60;
    sendSMSTimer: NodeJS.Timer;
    existentPhoneNum: string;
    isSendNewPhone: boolean = false;
    isVerified: boolean = false;
    currentPhoneNum: string;
    encryptPhoneNum: string;
    isSendSMS: boolean;
    code: string;
    codeSendInput: CodeSendInput = new CodeSendInput();
    changeBindingPhoneNumInput: ChangeBindingPhoneNumInput = new ChangeBindingPhoneNumInput();
    checkUserCodeInput: CheckUserCodeInput = new CheckUserCodeInput();
    @ViewChild("smsBtn") smsBtn: ElementRef;


    ngOnInit() {
        this.getUserPhoneNum();
    }


    verificationPhoneNum(): void {
        this.checkUserCodeInput.code = this.code;
        this.checkUserCodeInput.codeType = VerificationCodeType.PhoneUnBinding;
        this.isVerified = true;
        // this._SMSServiceProxy
        //     .checkCodeByCurrentUserAsync(this.checkUserCodeInput)
        //     .subscribe(() => {
        //         this.codeSendInput = new CodeSendInput();
        //     })
    }

    changeBindPhone(): void {
        this.changeBindingPhoneNumInput.validCode = this.code;
        this._profileServiceProxy
            .changeBindingPhoneNum(this.changeBindingPhoneNumInput)
            .subscribe(() => {
                this._location.back();
                setTimeout(() => {
                    this.notify.success("更绑成功");
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
                    this.notify.success("绑定成功");
                }, 1000);
            });
    }

    private getPhoneNum(realTimePhoneNum: string): void {

        if (this.time <= 0) {
            return;
        }

        if (realTimePhoneNum !== this.existentPhoneNum) {
            this.smsBtn.nativeElement.innerHTML = "发送验证码";
            this.isSendNewPhone = false;
            clearInterval(this.sendSMSTimer);
        } else {
            this.isSendNewPhone = true;
        }
    }

    VerificationCodeType(codeType: number): void {
        switch (codeType) {
            case 10:
                this.codeSendInput.codeType = VerificationCodeType.Register;
                break;
            case 20:
                this.codeSendInput.codeType = VerificationCodeType.Login;
                break;
            case 30:
                this.codeSendInput.codeType = VerificationCodeType.ChangePassword;
                break;
            case 40:
                this.codeSendInput.codeType = VerificationCodeType.ChangeEmail;
                break;
            case 50:
                this.codeSendInput.codeType = VerificationCodeType.PhoneBinding;
                break;
            case 60:
                this.codeSendInput.codeType = VerificationCodeType.PhoneUnBinding;
                break;
            case 70:
                this.codeSendInput.codeType = VerificationCodeType.PhoneVerify;
                break;
            default:
                break;

        }
    }

    // 发送验证码
    send(event, tel, codeType) {

        this.existentPhoneNum = tel;
        this.codeSendInput.targetNumber = tel;
        this.VerificationCodeType(codeType);
        // this.codeSendInput.codeType = VerificationCodeType.PhoneUnBinding;

        this._SMSServiceProxy
            .sendCodeAsync(this.codeSendInput)
            .subscribe(result => {
                this.time = 60;
                this.anginSend(event);
            });
    }

    anginSend(event) {
        this.isSendSMS = true;
        this.isSendNewPhone = true;
        this.sendSMSTimer = setInterval(() => {
            this.time--;
            event.target.innerHTML = `${this.time} 秒`;
        }, 1000)

        let timer = setTimeout(() => {
            clearTimeout(timer);
            clearInterval(this.sendSMSTimer);

            this.isSendSMS = false;
            this.isSendNewPhone = false;
            event.target.innerHTML = this.l("AgainSendValidateCode");
        }, 60000);
    }

    getUserPhoneNum(): void {
        this._profileServiceProxy
            .getCurrentUserProfileForEdit()
            .subscribe(result => {
                this.currentPhoneNum = result.phoneNumber;
                this.encrypt();
            })
    }


    private encrypt(): void {
        if (!this.currentPhoneNum) {
            return;
        }
        this.encryptPhoneNum = "•••••••" + this.currentPhoneNum.substr(this.currentPhoneNum.length - 4);
    }
}
