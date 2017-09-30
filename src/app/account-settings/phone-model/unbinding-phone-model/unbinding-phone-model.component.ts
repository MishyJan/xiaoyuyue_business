import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, CodeSendInput, SMSServiceProxy } from '@shared/service-proxies/service-proxies';
import { VerificationCodeType } from 'shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BindingPhoneModelComponent } from 'app/account-settings/phone-model/binding-phone-model/binding-phone-model.component';

@Component({
    selector: 'xiaoyuyue-unbinding-phone-model',
    templateUrl: './unbinding-phone-model.component.html',
    styleUrls: ['./unbinding-phone-model.component.scss']
})
export class UnbindingPhoneModelComponent extends AppComponentBase implements OnInit {
    code: string;
    model: CodeSendInput = new CodeSendInput();
    isSendSMS: boolean = false;
    phoneNumText: string;

    @ViewChild('unbindingPhoneModel') unbindingPhoneModel: ModalDirective;
    @ViewChild('bindingPhoneModel') bindingPhoneModel: BindingPhoneModelComponent;
    @ViewChild('smsBtn') _smsBtn: ElementRef;

    constructor(
        private injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy,
        private _SMSServiceProxy: SMSServiceProxy,
        private _appSessionService: AppSessionService

    ) {
        super(injector);

    }

    ngOnInit() {
        this.encrypt();
    }
    show(): void {
        this.unbindingPhoneModel.show();
    }

    hide(): void {
        this.unbindingPhoneModel.hide();
    }

    unbindingPhone(): void {
        this._profileServiceProxy
            .unBindingPhoneNum(this.code)
            .subscribe(result => {
                this.notify.success('解绑成功，请绑定新手机');
                this.hide();
                this.bindingPhoneModel.show();
            })
    }

    // 发送验证码
    send() {
        this.model.targetNumber = this._appSessionService.user.phoneNumber;
        this.model.codeType = VerificationCodeType.PhoneUnBinding;
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

    private encrypt(): void {
        if (!this._appSessionService.user.phoneNumber) {
            return;
        }
        this.phoneNumText = "•••••••" + this._appSessionService.user.phoneNumber.substr(this._appSessionService.user.phoneNumber.length - 4);
    }
}
