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
    code: string;
    codeType = VerificationCodeType.PhoneBinding;

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

    bindingPhone(): void {
        let input = new BindingPhoneNumInput();
        input.phoneNum = this.model.targetNumber;
        input.code = this.code;
        this._profileServiceProxy
            .bindingPhoneNum(input)
            .subscribe(result => {
                this.notify.success(this.l('Binding.Success.Hint'));
                abp.event.trigger('getUserSecurityInfo');
                this.hide();
            })
    }
}
