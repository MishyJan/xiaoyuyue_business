import { Component, OnInit, Injector, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { CodeSendInput, RegisterTenantInput, SMSServiceProxy, CodeSendInputCodeType } from 'shared/service-proxies/service-proxies';
import { VerificationCodeType } from 'shared/AppEnums';
import { SMSProviderDto } from 'shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-send-sms-code',
    templateUrl: './send-sms-code.component.html',
    styleUrls: ['./send-sms-code.component.scss']
})
export class SendSmsCodeComponent extends AppComponentBase implements OnInit, OnChanges {
    timeDiffTimer: NodeJS.Timer;
    sendTimer: NodeJS.Timer;
    isSendSMS = false;
    @ViewChild('smsBtn') _smsBtn: ElementRef;
    @Input() codeType: CodeSendInputCodeType;
    @Input() phoneNumber: string;

    constructor(
        private injector: Injector,
        private _SMSServiceProxy: SMSServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.phoneNumber) {
            this.isSendSMS = this.isValidPhoneNum(this.phoneNumber);

            if (this.phoneNumber === SMSProviderDto.phoneNum) {
                this.anginSend();
            } else {
                this._smsBtn.nativeElement.innerHTML = '获取验证码';
                this.clearSend();
            }
        }
    }

    // 发送验证码
    send() {
        let input: CodeSendInput = new CodeSendInput();
        input.targetNumber = SMSProviderDto.phoneNum = this.phoneNumber;
        input.codeType = this.codeType;
        // this.captchaResolved();

        this._SMSServiceProxy
            .sendCodeAsync(input)
            .subscribe(result => {
                this.anginSend();
                this.codeInterval();
            });
    }

    anginSend() {
        const self = this;
        this.isSendSMS = false;
        this.sendTimer = setInterval(() => {
            self._smsBtn.nativeElement.innerHTML = `${SMSProviderDto.sendCodeSecond} 秒`;
        }, SMSProviderDto.timeInterval);
    }

    clearSend(): void {
        clearInterval(this.sendTimer);
    }

    private codeInterval(): void {
        SMSProviderDto.sendCodeSecond = 60;
        const timer = setInterval(() => {
            SMSProviderDto.sendCodeSecond--;
            if (SMSProviderDto.sendCodeSecond <= 0) {
                this.isSendSMS = true;
                this._smsBtn.nativeElement.innerHTML = this.l('AgainSendValidateCode');
                SMSProviderDto.phoneNum = '';
                this.clearSend();
                clearInterval(timer);
            }
        }, SMSProviderDto.timeInterval)
    }

    private isValidPhoneNum(phoneNum: string): boolean {
        const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        return reg.test(phoneNum);
    }
}
