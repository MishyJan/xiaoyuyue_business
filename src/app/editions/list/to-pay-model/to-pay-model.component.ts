import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ModalDirective } from 'ngx-bootstrap';
import { VerificationCodeType } from 'shared/AppEnums';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { EditionSelectDto, EditionSubscriptionServiceProxy, PaymentServiceProxy, CreatePaymentDto, CreatePaymentDtoEditionPaymentType, CreatePaymentDtoPaymentPeriodType, CreatePaymentDtoSubscriptionPaymentGatewayType } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'xiaoyuyue-to-pay-model',
    templateUrl: './to-pay-model.component.html',
    styleUrls: ['./to-pay-model.component.scss'],
    animations: [accountModuleAnimation()]
})
export class ToPayModelComponent extends AppComponentBase implements OnInit {
    finalPrice: number;
    editionId: number;
    createPaymentDto: CreatePaymentDto;
    // 选择的版本索引值
    selectEditionIndex: number;
    // 选择的时长索引值
    selectTimeIndex = 3;
    edition: EditionSelectDto = new EditionSelectDto();
    wechatQrcodeContent: string;
    @ViewChild('toPayModel') modal: ModalDirective;
    constructor(
        private injector: Injector,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy,
        private paymentServiceProxy: PaymentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    selectTimeHandle(index: number, price: number): void {
        this.selectTimeIndex = index;
        this.finalPrice = price;
        if (index === 1) {
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._365;
        } else if (index === 2) {
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._90;
        } else {
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
        }

        this.createPayment();
    }

    show(editionId: number): void {
        this.editionId = editionId;
        this.selectTimeIndex = 3;
        this.initCreatePayMent();
        this._editionSubscriptionService
            .getEdition(editionId)
            .subscribe((result) => {
                this.edition = result;
                this.finalPrice = result.monthlyPrice;
                this.modal.show();
            });
    }

    hide(): void {
        this.modal.hide();
    }

    // 进入此model组件默认初始化：时长类型、版本类型、支付方式等等
    private initCreatePayMent(): void {
        this.createPaymentDto = new CreatePaymentDto();
        this.createPaymentDto.editionId = this.editionId;
        this.createPaymentDto.editionPaymentType = CreatePaymentDtoEditionPaymentType._1;
        this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
        this.createPaymentDto.subscriptionPaymentGatewayType = CreatePaymentDtoSubscriptionPaymentGatewayType._1;
        this.createPayment();
    }

    // 创建支付
    private createPayment(): void {
        // this.createPaymentDto.editionId = this.editionId;
        // this.createPaymentDto.editionPaymentType = CreatePaymentDtoEditionPaymentType._1;
        // this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
        // this.createPaymentDto.subscriptionPaymentGatewayType = CreatePaymentDtoSubscriptionPaymentGatewayType._1;

        this.paymentServiceProxy.createPayment(this.createPaymentDto).subscribe((result) => {
            this.wechatQrcodeContent = result.additionalData['CodeUrl'];
        });
    }
}
