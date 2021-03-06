import { AccountServiceProxy, CodeSendInput, CodeSendInputCodeType, RegisterTenantInput, SMSServiceProxy, SendEmailVerificationCodeInput } from 'shared/service-proxies/service-proxies';
import { Component, ElementRef, Injector, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { SendCodeType, VerificationCodeType } from 'shared/AppEnums';

import { AppComponentBase } from 'shared/common/app-component-base';
import { SMSProviderDto } from 'shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-send-code',
    templateUrl: './send-code.component.html',
    styleUrls: ['./send-code.component.scss']
})
export class SendCodeComponent extends AppComponentBase implements OnInit, OnChanges {
    timeDiffTimer: NodeJS.Timer;
    sendTimer: NodeJS.Timer;
    isSend = false;
    sending = false;
    @ViewChild('smsBtn') _smsBtn: ElementRef;
    @ViewChild('smsBtnSpan') _smsBtnSpan: ElementRef;
    @Input() codeType;
    @Input() sendCodeType = SendCodeType.ShortMessage;
    @Input() phoneNumber: string;
    @Input() emailAddress: string;

    constructor(
        private injector: Injector,
        private _SMSServiceProxy: SMSServiceProxy,
        private _accountServiceProxy: AccountServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.phoneNumber) {
            this.isSend = this.isValidPhoneNum(this.phoneNumber);
            if (this.phoneNumber === SMSProviderDto.phoneNum) {
                this.updateSendState();
            } else {
                this._smsBtnSpan.nativeElement.innerHTML = this.l('GetVerificationCode');
                this.clearSendHandle();
            }
        }

        if (this.emailAddress) {
            this.isSend = this.isValidEmailAddress(this.emailAddress);
            if (this.emailAddress === SMSProviderDto.emailAddress) {
                this.updateSendState();
            } else {
                this._smsBtnSpan.nativeElement.innerHTML = this.l('GetVerificationCode');
                this.clearSendHandle();
            }
        }
    }

    send() {
        if (!this.sendCodeType) { return; }
        switch (this.sendCodeType) {
            case SendCodeType.ShortMessage:
                this.sendShortMessage();
                break;
            case SendCodeType.Email:
                this.sendEmail();
                break;
            default:
                break;
        }
    }

    updateSendState() {
        const self = this;
        this.isSend = false;
        self._smsBtnSpan.nativeElement.innerHTML = `${SMSProviderDto.sendCodeSecond} ${this.l('Second')}`;
        this.sendTimer = setInterval(() => {
            if (SMSProviderDto.sendCodeSecond <= 0) {
                this.isSend = true;
                SMSProviderDto.phoneNum = '';
                SMSProviderDto.emailAddress = '';
                this._smsBtnSpan.nativeElement.innerHTML = this.l('AgainSendValidateCode');
                this.clearSendHandle();
                return;
            }
            self._smsBtnSpan.nativeElement.innerHTML = `${SMSProviderDto.sendCodeSecond} ${this.l('Second')}`;
        }, 100);
    }

    clearSendHandle(): void {
        clearInterval(this.sendTimer);
    }

    // 发送短信验证码
    private sendShortMessage(): void {
        this.sending = true;
        const input: CodeSendInput = new CodeSendInput();
        input.targetNumber = SMSProviderDto.phoneNum = this.phoneNumber;
        input.codeType = this.codeType;
        // this.captchaResolved();
        this._SMSServiceProxy
            .sendCode(input)
            .finally(() => {
                this.sending = false;
            })
            .subscribe(result => {
                this.sending = false;
                this.updateSendState();
                this.codeInterval();
            });
    }

    // 发送邮件验证码
    private sendEmail(): void {
        this.sending = true;
        const input: SendEmailVerificationCodeInput = new SendEmailVerificationCodeInput();
        input.emailAddress = SMSProviderDto.emailAddress = this.emailAddress;
        input.codeType = this.codeType;
        this._accountServiceProxy
            .sendEmailVerificationCode(input)
            .finally(() => {
                this.sending = false;
            })
            .subscribe(result => {
                this.sending = false;
                this.updateSendState();
                this.codeInterval();
            })
    }

    private codeInterval(): void {
        SMSProviderDto.sendCodeSecond = 59;
        const timer = setInterval(() => {
            SMSProviderDto.sendCodeSecond--;
            if (SMSProviderDto.sendCodeSecond <= 0) {
                clearInterval(timer);
            }
        }, SMSProviderDto.timeInterval)
    }
}
