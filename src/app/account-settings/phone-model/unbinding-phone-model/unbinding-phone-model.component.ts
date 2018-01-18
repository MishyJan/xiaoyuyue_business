import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, CodeSendInput } from '@shared/service-proxies/service-proxies';
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
    codeType = VerificationCodeType.PhoneUnBinding;

    @ViewChild('unbindingPhoneModel') unbindingPhoneModel: ModalDirective;
    @ViewChild('bindingPhoneModel') bindingPhoneModel: BindingPhoneModelComponent;

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
        this.unbindingPhoneModel.show();
    }

    hide(): void {
        this.unbindingPhoneModel.hide();
    }

    unbindingPhone(): void {
        this._profileServiceProxy
            .unBindingPhoneNum(this.code)
            .subscribe(result => {
                this.notify.success(this.l('RebindingPhone.Success.Hint'));
                this._sessionService.init();
                abp.event.trigger('getUserSecurityInfo');
                this.hide();
                this.bindingPhoneModel.show();
            })
    }
}
