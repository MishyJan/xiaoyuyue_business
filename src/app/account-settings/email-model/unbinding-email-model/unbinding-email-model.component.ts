import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, CodeSendInput, SMSServiceProxy } from '@shared/service-proxies/service-proxies';
import { VerificationCodeType, SendCodeType } from 'shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BindingEmailModelComponent } from 'app/account-settings/email-model/binding-email-model/binding-email-model.component';

@Component({
    selector: 'xiaoyuyue-unbinding-email-model',
    templateUrl: './unbinding-email-model.component.html',
    styleUrls: ['./unbinding-email-model.component.scss']
})
export class UnbindingEmailModelComponent extends AppComponentBase implements OnInit {
    emailAddress: string;
    code: string;
    model: CodeSendInput = new CodeSendInput();
    emailAddressText: string;
    codeType = 50;
    sendCodeType = SendCodeType.Email;

    @ViewChild('unbindingEmailModel') unbindingEmailModel: ModalDirective;
    @ViewChild('bindingEmailModel') bindingEmailModel: BindingEmailModelComponent;
    @ViewChild('smsBtn') _smsBtn: ElementRef;

    constructor(
        private injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy,
        private _SMSServiceProxy: SMSServiceProxy,
        private _appSessionService: AppSessionService

    ) {
        super(injector);
        this.emailAddress = this._appSessionService.user.emailAddress;
    }

    ngOnInit() {
        this.encrypt();
    }
    show(): void {
        this.unbindingEmailModel.show();
    }

    hide(): void {
        this.unbindingEmailModel.hide();
    }

    unbindingEmail(): void {
        this._profileServiceProxy
            .unBindingEmailAddress(this.code)
            .subscribe(result => {
                this.notify.success('解绑成功，请绑定新邮箱');
                this.hide();
                this.bindingEmailModel.show();
            })
    }

    private encrypt(): void {
        if (!this.emailAddress) {
            return;
        }
        this.emailAddressText = '•••••••' + this.emailAddress.substr(this._appSessionService.user.phoneNumber.length - 8);
    }
}
