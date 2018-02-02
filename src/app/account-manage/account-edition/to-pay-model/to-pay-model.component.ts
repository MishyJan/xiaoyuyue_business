import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { CreatePaymentDto, CreatePaymentDtoEditionPaymentType, CreatePaymentDtoPaymentPeriodType, CreatePaymentDtoSubscriptionPaymentGatewayType, EditionSelectDto, EditionViewServiceProxy, PaymentServiceProxy } from '@shared/service-proxies/service-proxies';

import { AdditionalData } from './../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ModalDirective } from 'ngx-bootstrap';
import { VerificationCodeType } from 'shared/AppEnums';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

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
    edition: EditionSelectDto = new EditionSelectDto();
    wechatQrcodeContent: string;
    @ViewChild('toPayModel') modal: ModalDirective;
    constructor(
        private injector: Injector,
        private editionViewService: EditionViewServiceProxy,
        private paymentServiceProxy: PaymentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    selectTimeHandle(index: number): void {
        this.selectTimeIndex = index;
    }

    show(editionId: number): void {
        this.editionViewService.getEdition(editionId).subscribe((result) => {
            this.edition = result;
            this.modal.show();
            const createInput = new CreatePaymentDto();
            createInput.editionId = editionId;
            createInput.editionPaymentType = CreatePaymentDtoEditionPaymentType._1;
            createInput.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
            createInput.subscriptionPaymentGatewayType = CreatePaymentDtoSubscriptionPaymentGatewayType._1;
            this.paymentServiceProxy.createPayment(createInput).subscribe((result) => {
                this.wechatQrcodeContent = result.additionalData['CodeUrl'];
            });
        });
    }

    hide(): void {
        this.modal.hide();
    }
}
