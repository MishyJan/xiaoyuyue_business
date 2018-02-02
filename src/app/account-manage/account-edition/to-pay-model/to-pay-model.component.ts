import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, ChangePasswordInput, ChangePasswordByPhoneInput, CodeSendInput, SMSServiceProxy, PasswordComplexitySetting } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { VerificationCodeType } from 'shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    selector: 'xiaoyuyue-to-pay-model',
    templateUrl: './to-pay-model.component.html',
    styleUrls: ['./to-pay-model.component.scss'],
    animations: [accountModuleAnimation()]
})
export class ToPayModelComponent extends AppComponentBase implements OnInit {
    // 选择的版本索引值
    selectEditionIndex: number;
    // 选择的时长索引值
    selectTimeIndex = 1;
    @ViewChild('toPayModel') modal: ModalDirective;
    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    selectTimeHandle(index: number): void {
        this.selectTimeIndex = index;
    }

    show(): void {
        this.modal.show();
    }

    hide(): void {
        this.modal.hide();
    }
}
