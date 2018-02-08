import { Component, Injector, OnInit } from '@angular/core';
import { CreatePaymentDto, CreatePaymentDtoEditionPaymentType, CreatePaymentDtoPaymentPeriodType, CreatePaymentDtoSubscriptionPaymentGatewayType, EditionSelectDto, EditionSubscriptionServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { Router } from '@angular/router';
import { WeChatPaymentService } from 'shared/services/wechat-payment.service';

@Component({
    selector: 'xiaoyuyue-to-pay-mobile',
    templateUrl: './to-pay-mobile.component.html',
    styleUrls: ['./to-pay-mobile.component.scss']
})
export class ToPayMobileComponent extends AppComponentBase implements OnInit {
    selectTimeIndex = 3;
    edition: EditionSelectDto = new EditionSelectDto();
    editionId = 2;
    finalPrice: number;
    createPaymentDto: CreatePaymentDto;

    constructor(
        private injector: Injector,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy,
        private _wechatPaymentService: WeChatPaymentService,
        private _router: Router,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.loadData();
        this.initCreatePayMent();

        this._wechatPaymentService.successAction.subscribe((result) => {
            this.processPaymentResult(result);
        });
    }

    loadData(): void {
        this._editionSubscriptionService
            .getEdition(this.editionId)
            .subscribe((result) => {
                this.edition = result;
                this.finalPrice = result.monthlyPrice;
            });
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
    }

    // 进入此model组件默认初始化：时长类型、版本类型、支付方式等等
    private initCreatePayMent(): void {
        this.createPaymentDto = new CreatePaymentDto();
        this.createPaymentDto.editionId = 2;
        this.createPaymentDto.editionPaymentType = CreatePaymentDtoEditionPaymentType._1;
        this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
        this.createPaymentDto.subscriptionPaymentGatewayType = CreatePaymentDtoSubscriptionPaymentGatewayType._1;
        // this.createPayment();
    }

    createPayment(): void {
        this._wechatPaymentService.invokeWeChatPayment(this.createPaymentDto)
    }

    processPaymentResult(result: boolean) {
        if (result) {
            this.notify.success('支付成功');
            this.appSession.init();
            this._router.navigate(['/account/condition']);
        } else {
            this.notify.success('支付失败，请重试');
        }

    }
}
