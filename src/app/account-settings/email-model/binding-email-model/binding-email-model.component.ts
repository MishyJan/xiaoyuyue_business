import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ProfileServiceProxy, CodeSendInput, BindingEmailInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { VerificationCodeType, SendCodeType } from 'shared/AppEnums';
import { AppSessionService } from 'shared/common/session/app-session.service';

@Component({
    selector: 'xiaoyuyue-binding-email-model',
    templateUrl: './binding-email-model.component.html',
    styleUrls: ['./binding-email-model.component.scss']
})
export class BindingEmailModelComponent extends AppComponentBase implements OnInit {
    input: BindingEmailInput = new BindingEmailInput();
    codeType = VerificationCodeType.EmailBinding;
    sendCodeType = SendCodeType.Email;

    @ViewChild('bindingEmailModel') bindingEmailModel: ModalDirective;
    @ViewChild('smsBtn') _smsBtn: ElementRef;

    constructor(
        private injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy,
        public _sessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    show(): void {
        this.bindingEmailModel.show();
    }

    hide(): void {
        this.bindingEmailModel.hide();
    }

    bindingPhone(): void {
        this._profileServiceProxy
            .bindingEmailAddress(this.input)
            .subscribe(result => {
                this.notify.success(this.l('Binding.Success.Hint'));
                this._sessionService.init();
                abp.event.trigger('getUserSecurityInfo');
                this.hide();
            })
    }
}
