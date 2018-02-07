import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ModalDirective } from 'ngx-bootstrap';
import { VerificationCodeType } from 'shared/AppEnums';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { EditionSelectDto, EditionSubscriptionServiceProxy, PaymentServiceProxy, CreatePaymentDto, CreatePaymentDtoEditionPaymentType, CreatePaymentDtoPaymentPeriodType, CreatePaymentDtoSubscriptionPaymentGatewayType, EditionWithFeaturesDto } from 'shared/service-proxies/service-proxies';
export class EditionOutput {
    /*
        editionsInfo：获取所有版本信息
        editionId：获取要开通的版本ID
        editionPaymentType：购买来源，开通、升级、续费
    */
    editionsInfo: EditionWithFeaturesDto[];
    editionId: number;
    editionPaymentType: CreatePaymentDtoEditionPaymentType;
}
@Component({
    selector: 'xiaoyuyue-to-pay-model',
    templateUrl: './to-pay-model.component.html',
    styleUrls: ['./to-pay-model.component.scss'],
    animations: [accountModuleAnimation()]
})
export class ToPayModelComponent extends AppComponentBase implements OnInit {
    editionOutput: EditionOutput;
    selectTypeIndex: number;
    edition: EditionSelectDto = new EditionSelectDto();
    editionsInfo: EditionWithFeaturesDto[];
    paymentId: string;
    paymentTimer: NodeJS.Timer;
    finalPrice: number;
    editionId: number;
    createPaymentDto: CreatePaymentDto;
    // 选择的版本索引值
    selectEditionIndex: number;
    // 选择的时长索引值
    selectTimeIndex = 3;
    alipayQrcodeContent: string;
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

    selectTimeHandle(index: number): void {
        this.selectTimeIndex = index;
        this.updateFinalPrice();
        this.createWeChatPayment();
        this.createAlipayPayment();
        this.scanQRCodePaysStatus();
    }

    private updateFinalPrice(): void {
        if (this.selectTimeIndex === 1) {
            this.finalPrice = this.edition.annualPrice;
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._365;
        } else if (this.selectTimeIndex === 2) {
            this.finalPrice = this.edition.seasonPrice;
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._90;
        } else if (this.selectTimeIndex === 3) {
            this.finalPrice = this.edition.monthlyPrice;
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
        }
    }

    selectTypeHandle(index: number, edition: EditionWithFeaturesDto): void {
        this.edition = edition.edition;
        this.editionId = edition.edition.id;
        this.selectTypeIndex = index;
        this.updateFinalPrice();
        this.createWeChatPayment();
        this.createAlipayPayment();
        this.scanQRCodePaysStatus();
    }

    show(editionOutput: EditionOutput): void {
        this.editionOutput = editionOutput;
        this.initCreatePayMent();
        this.scanQRCodePaysStatus();
        this.modal.show();
    }

    hide(): void {
        this.modal.hide();
        clearInterval(this.paymentTimer);
    }

    onHidden(): void {
        clearInterval(this.paymentTimer);
    }

    // 进入此model组件默认初始化：时长类型、版本类型、支付方式等等
    private initCreatePayMent(): void {
        this.editionsInfo = this.editionOutput.editionsInfo;
        this.editionId = this.editionOutput.editionId;
        this.editionsInfo.forEach(edition => {
            if (edition.edition.id === this.editionId) {
                this.edition = edition.edition;
                this.finalPrice = edition.edition.monthlyPrice;
            }
        });
        if (this.editionId === 2) {
            this.selectTypeIndex = 0;
        } else if (this.editionId === 3) {
            this.selectTypeIndex = 1;
        }
        this.selectTimeIndex = 3;

        this.createPaymentDto = new CreatePaymentDto();
        this.createPaymentDto.editionId = this.editionId;
        this.createPaymentDto.editionPaymentType = this.editionOutput.editionPaymentType;
        this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
        this.createWeChatPayment();
        this.createAlipayPayment();
    }

    // 创建微信支付
    private createWeChatPayment(): void {
        this.createPaymentDto.editionId = this.editionId;
        this.createPaymentDto.subscriptionPaymentGatewayType = CreatePaymentDtoSubscriptionPaymentGatewayType._1;
        clearInterval(this.paymentTimer);
        this.paymentServiceProxy
            .createPayment(this.createPaymentDto)
            .subscribe((result) => {
                this.wechatQrcodeContent = result.additionalData['CodeUrl'];
                this.paymentId = result.paymentId;
            });
    }

    // 创建支付宝支付
    private createAlipayPayment(): void {
        this.createPaymentDto.editionId = this.editionId;
        this.createPaymentDto.subscriptionPaymentGatewayType = CreatePaymentDtoSubscriptionPaymentGatewayType._2;
        clearInterval(this.paymentTimer);
        this.paymentServiceProxy
            .createPayment(this.createPaymentDto)
            .subscribe((result) => {
                this.alipayQrcodeContent = result.additionalData['CodeUrl'];
                this.paymentId = result.paymentId;
            });
    }

    // 定时查询订单状态
    private scanQRCodePaysStatus(): void {
        this.paymentTimer = setInterval(() => {
            if (!this.paymentId) { return; }
            this.paymentServiceProxy
                .queryPayment(this.paymentId)
                .subscribe(result => {
                    if (result.paid) {
                        this.message.success('支付成功');
                        clearInterval(this.paymentTimer);
                        this.hide();
                    }
                })
        }, 5000);
    }
}
