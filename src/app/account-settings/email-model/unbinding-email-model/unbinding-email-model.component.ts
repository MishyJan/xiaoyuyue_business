import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, CodeSendInput, UserSecurityInfoDto } from '@shared/service-proxies/service-proxies';
import { VerificationCodeType, SendCodeType } from 'shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BindingEmailModelComponent } from 'app/account-settings/email-model/binding-email-model/binding-email-model.component';

@Component({
    selector: 'xiaoyuyue-unbinding-email-model',
    templateUrl: './unbinding-email-model.component.html',
    styleUrls: ['./unbinding-email-model.component.scss']
})
export class UnbindingEmailModelComponent extends AppComponentBase implements OnInit {
    phoneNum: string;
    userSecurityInfo: UserSecurityInfoDto;
    emailAddress: string;
    code: string;
    model: CodeSendInput = new CodeSendInput();
    codeType = VerificationCodeType.ChangeEmail;
    sendCodeType = SendCodeType.Email;

    @ViewChild('unbindingEmailModel') unbindingEmailModel: ModalDirective;
    @ViewChild('bindingEmailModel') bindingEmailModel: BindingEmailModelComponent;
    @ViewChild('smsBtn') _smsBtn: ElementRef;

    constructor(
        private injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy,
        public _sessionService: AppSessionService
    ) {
        super(injector);
        this.emailAddress = this._sessionService.user.emailAddress;
        this.phoneNum = this._sessionService.user.phoneNumber;
    }

    ngOnInit() {
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
                this.notify.success(this.l('RebindingEmail.Success.Hint'));
                this._sessionService.init();
                abp.event.trigger('getUserSecurityInfo');
                this.hide();
                this.bindingEmailModel.show();
            })
    }
}
