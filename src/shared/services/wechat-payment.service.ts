import { ActivatedRouteSnapshot, Event, NavigationEnd, Router } from '@angular/router';
import { CreatePaymentDto, PaymentServiceProxy } from 'shared/service-proxies/service-proxies';
import { EventEmitter, Injectable } from '@angular/core';

import { AppServiceBase } from 'shared/services/base.service';
import { RandomHelper } from 'shared/helpers/RandomHelper';
import { TitleService } from 'shared/services/title.service';

@Injectable()
export class WeChatPaymentService {
    successAction = new EventEmitter<boolean>();
    constructor(
        private _paymentService: PaymentServiceProxy) {
    }

    invokeWeChatPayment(createPaymentDto: CreatePaymentDto) {
        this._paymentService.createJsPayment(createPaymentDto).subscribe(result => {
            WeixinJSBridge.invoke('getBrandWCPayRequest', {
                'appId': result.additionalData['appId'], // 公众号名称，由商户传入
                'timeStamp': result.additionalData['timeStamp'], // 时间戳
                'nonceStr': result.additionalData['nonceStr'], // 随机串
                'package': result.additionalData['package'], // 扩展包
                'signType': 'MD5', // 微信签名方式
                'paySign': result.additionalData['paySign'] // 微信签名
            }, (res) => {
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    this.successAction.emit(true);
                } else {
                    this.successAction.emit(false);
                }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功
            });
        });
    }
}
