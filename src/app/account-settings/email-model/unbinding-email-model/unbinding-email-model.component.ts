import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, CodeSendInput, SMSServiceProxy, UserSecurityInfoDto } from '@shared/service-proxies/service-proxies';
import { VerificationCodeType, SendCodeType } from 'shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BindingEmailModelComponent } from 'app/account-settings/email-model/binding-email-model/binding-email-model.component';

@Component({
    selector: 'xiaoyuyue-unbinding-email-model',
    templateUrl: './unbinding-email-model.component.html',
    styleUrls: ['./unbinding-email-model.component.scss']
})
export class UnbindingEmailModelComponent extends AppComponentBase implements OnInit {
    phoneNumber: string;
    userSecurityInfo: UserSecurityInfoDto;
    emailAddress: string;
    code: string;
    model: CodeSendInput = new CodeSendInput();
    emailAddressText: string;
    codeType = VerificationCodeType.ChangeEmail;
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
        this.phoneNumber = this._appSessionService.user.phoneNumber;
    }

    ngOnInit() {
        if (!this.emailAddress) {
            return;
        }
        this.encrypt();
    }
    show(): void {
        this.unbindingEmailModel.show();
    }

    hide(): void {
        this.unbindingEmailModel.hide();
    }

    unbindingEmail(): void {
        if (!this.checkMustBinding()) {
            return;
        }
        this._profileServiceProxy
            .unBindingEmailAddress(this.code)
            .subscribe(result => {
                this.notify.success(this.l('RebindingEmail.Success.Hint'));
                abp.event.trigger('getUserSecurityInfo');
                this.hide();
                this.bindingEmailModel.show();
            })
    }

    private checkMustBinding(): boolean {
        if (!this.phoneNumber) {
            this.message.error(this.l('UnBindingEmail.RequiredPhoneNumber.Hint'));
            return false;
        }
        return true;
    }

    private encrypt(): void {
        this.emailAddressText = '•••••••' + this.emailAddress.substr(this._appSessionService.user.emailAddress.length - 8);
    }
}
