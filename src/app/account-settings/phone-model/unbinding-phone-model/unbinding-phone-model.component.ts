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
    emailAddress: string;
    phoneNum: string;
    code: string;
    model: CodeSendInput = new CodeSendInput();
    phoneNumText: string;
    codeType = VerificationCodeType.PhoneUnBinding;

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
        this.emailAddress = this._appSessionService.user.emailAddress;
        this.phoneNum = this._appSessionService.user.phoneNumber;
    }

    ngOnInit() {
    }
    show(): void {
        this.unbindingPhoneModel.show();
    }

    hide(): void {
        this.unbindingPhoneModel.hide();
    }

    unbindingPhone(): void {
        if (!this.checkMustBinding()) {
            return;
        }
        this._profileServiceProxy
            .unBindingPhoneNum(this.code)
            .subscribe(result => {
                this.notify.success(this.l('RebindingPhone.Success.Hint'));
                abp.event.trigger('getUserSecurityInfo');
                this.hide();
                this.bindingPhoneModel.show();
            })
    }

    private checkMustBinding(): boolean {
        if (!this.emailAddress) {
            this.message.error(this.l('UnBindingPhoneNum.RequiredEmail.Hint'));
            return false;
        }
        return true;
    }
}
