import { Component, OnInit, Injector, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { CodeSendInput, RegisterTenantInput, SMSServiceProxy, CodeSendInputCodeType, AccountServiceProxy, SendEmailVerificationCodeInput } from 'shared/service-proxies/service-proxies';
import { VerificationCodeType, SendCodeType } from 'shared/AppEnums';
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
    @ViewChild('smsBtn') _smsBtn: ElementRef;
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
                this.anginSend();
            } else {
                this._smsBtn.nativeElement.innerHTML = '获取验证码';
                this.clearSendHandle();
            }
        }

        if (this.emailAddress) {
            this.isSend = this.isValidEmailAddress(this.emailAddress);
            if (this.emailAddress === SMSProviderDto.emailAddress) {
                this.anginSend();
            } else {
                this._smsBtn.nativeElement.innerHTML = '获取验证码';
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

    anginSend() {
        const self = this;
        this.isSend = false;
        this.sendTimer = setInterval(() => {
            self._smsBtn.nativeElement.innerHTML = `${SMSProviderDto.sendCodeSecond} 秒`;
        }, SMSProviderDto.timeInterval);
    }

    clearSendHandle(): void {
        clearInterval(this.sendTimer);
    }

    // 发送短信验证码
    private sendShortMessage(): void {
        let input: CodeSendInput = new CodeSendInput();
        input.targetNumber = SMSProviderDto.phoneNum = this.phoneNumber;
        input.codeType = this.codeType;
        // this.captchaResolved();
        this._SMSServiceProxy
            .sendCode(input)
            .subscribe(result => {
                this.anginSend();
                this.codeInterval();
            });
    }

    // 发送邮件验证码
    private sendEmail(): void {
        let input: SendEmailVerificationCodeInput = new SendEmailVerificationCodeInput();
        input.emailAddress = SMSProviderDto.emailAddress = this.emailAddress;
        input.codeType = this.codeType;
        this._accountServiceProxy
            .sendEmailVerificationCode(input)
            .subscribe(result => {
                this.anginSend();
                this.codeInterval();
            })
    }

    private codeInterval(): void {
        SMSProviderDto.sendCodeSecond = 60;
        const timer = setInterval(() => {
            SMSProviderDto.sendCodeSecond--;
            if (SMSProviderDto.sendCodeSecond <= 0) {
                this.isSend = true;
                this._smsBtn.nativeElement.innerHTML = this.l('AgainSendValidateCode');
                SMSProviderDto.phoneNum = '';
                SMSProviderDto.emailAddress = '';
                this.clearSendHandle();
                clearInterval(timer);
            }
        }, SMSProviderDto.timeInterval)
    }

    private isValidPhoneNum(phoneNum: string): boolean {
        const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        return reg.test(phoneNum);
    }

    private isValidEmailAddress(emailAddress: string): boolean {
        const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return reg.test(emailAddress);
    }
}
