import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ProfileServiceProxy, CodeSendInput, SMSServiceProxy, BindingPhoneNumInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VerificationCodeType } from 'shared/AppEnums';

@Component({
    selector: 'xiaoyuyue-binding-phone-model',
    templateUrl: './binding-phone-model.component.html',
    styleUrls: ['./binding-phone-model.component.scss']
})
export class BindingPhoneModelComponent extends AppComponentBase implements OnInit {
    model: CodeSendInput = new CodeSendInput();
    isSendSMS: boolean = false;
    code: string;

    @ViewChild('bindingPhoneModel') bindingPhoneModel: ModalDirective;
    @ViewChild('smsBtn') _smsBtn: ElementRef;

    constructor(
        private injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy,
        private _SMSServiceProxy: SMSServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    show(): void {
        this.bindingPhoneModel.show();
    }

    hide(): void {
        this.bindingPhoneModel.hide();
    }

    // 发送验证码
    send() {
        this.model.targetNumber = this.model.targetNumber;
        this.model.codeType = VerificationCodeType.PhoneBinding;
        // this.captchaResolved();

        this._SMSServiceProxy
            .sendCodeAsync(this.model)
            .subscribe(result => {
                this.anginSend();
            });
    }

    anginSend() {
        let self = this;
        let time = 60;
        this.isSendSMS = true;
        let set = setInterval(() => {
            time--;
            self._smsBtn.nativeElement.innerHTML = `${time} 秒`;
        }, 1000)

        setTimeout(() => {
            clearInterval(set);
            self.isSendSMS = false;
            self._smsBtn.nativeElement.innerHTML = this.l("AgainSendValidateCode");
        }, 60000);
    }


    bindingPhone(): void {
        let input = new BindingPhoneNumInput();
        input.phoneNum = this.model.targetNumber;
        input.code = this.code;
        this._profileServiceProxy
            .bindingPhoneNum(input)
            .subscribe(result => {
                this.notify.success('绑定成功');
                this.hide();
            })
    }
}
