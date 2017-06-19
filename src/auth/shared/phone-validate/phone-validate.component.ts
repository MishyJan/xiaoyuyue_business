import { Component, OnInit, Injector, ElementRef, Directive, ViewChild } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { CodeSendInput, SMSServiceProxy } from "shared/service-proxies/service-proxies";
import { VerificationCodeType } from "shared/AppEnums";

@Component({
  selector: 'PhoneValidate',
  templateUrl: './phone-validate.component.html',
  styleUrls: ['./phone-validate.component.less']
})
export class PhoneValidateComponent extends AppComponentBase implements OnInit {
  phoneNumber: string;
  validateCode: string;
  input: CodeSendInput = new CodeSendInput();

  @ViewChild('smsBtn') _smsBtn: ElementRef;

  constructor(
    injector: Injector,
    private el: ElementRef,
    private _SMSServiceProxy: SMSServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
  }
  send() {
    this.input.targetNumber = this.phoneNumber;
    this.input.codeType = VerificationCodeType.Register;
    this.input.captchaResponse = this.captchaResolved();

    this._SMSServiceProxy
      .sendCodeAsync(this.input)
      .subscribe(result => {
        this.anginSend();
      });
  }

  captchaResolved(): string {
    let captchaResponse = $('#lc-captcha-response').val();
    return captchaResponse;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  anginSend() {
    let self = this;
    let time = 60;
    let set = setInterval(() => {
      time--;
      self._smsBtn.nativeElement.innerHTML = `${time} 秒`;
    }, 1000)

    setTimeout(() => {
      clearInterval(set);
      self._smsBtn.nativeElement.innerHTML = this.l("AgainSendValidateCode");
    }, 60000);
  }
}
