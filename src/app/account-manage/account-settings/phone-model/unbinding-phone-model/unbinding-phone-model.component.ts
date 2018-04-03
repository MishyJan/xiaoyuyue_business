import { CodeSendInput, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BindingPhoneModelComponent } from 'app/account-manage/account-settings/phone-model/binding-phone-model/binding-phone-model.component';
import { ModalDirective } from 'ngx-bootstrap';
import { VerificationCodeType } from 'shared/AppEnums';

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
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
        this.emailAddress = this.appSession.user.emailAddress;
        this.phoneNum = this.appSession.user.phoneNumber;
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
                this.appSession.init();
                abp.event.trigger('getUserSecurityInfo');
                this.hide();
                this.bindingPhoneModel.show();
            })
    }
}
