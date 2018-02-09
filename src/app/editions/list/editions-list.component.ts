import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CreatePaymentDtoEditionPaymentType, EditionSubscriptionServiceProxy, EditionWithFeaturesDto, EditionsSelectOutput, FlatFeatureSelectDto, NameValueDto, CreatePaymentDto, CreatePaymentDtoPaymentPeriodType, PaymentServiceProxy, CreatePaymentDtoSubscriptionPaymentGatewayType } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { GetCurrentFeatures } from 'shared/AppConsts';
import { Router } from '@angular/router';
import { ToPayModelComponent } from 'app/editions/list/to-pay-model/to-pay-model.component';
import { accountModuleAnimation } from 'shared/animations/routerTransition';

import { AccountEditionOutput } from 'app/shared/utils/account-edition';
import { PaysType } from 'shared/AppEnums';
import * as _ from 'lodash';
import { WeChatPaymentService } from 'shared/services/wechat-payment.service';

@Component({
    selector: 'xiaoyuyue-editions-list',
    templateUrl: './editions-list.component.html',
    styleUrls: ['./editions-list.component.scss'],
    animations: [accountModuleAnimation()]
})
export class EditionsListComponent extends AppComponentBase implements OnInit {
    notWeChatPaysTips: string;
    cannotPays: boolean;
    selectEdition: EditionWithFeaturesDto;
    finalPrice: number;
    additionalData: { [key: string]: string; };
    createPaymentDto: CreatePaymentDto;
    selectTimeIndex: number;
    editionOutput: AccountEditionOutput = new AccountEditionOutput();
    allFeatures: FlatFeatureSelectDto[];
    tenantEditionId: number;
    editionsWithFeatures: EditionWithFeaturesDto[];
    @ViewChild('toPayModel') toPayModel: ToPayModelComponent;
    constructor(
        private injector: Injector,
        private _wechatPaymentService: WeChatPaymentService,
        private _paymentService: PaymentServiceProxy,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy,
        private _router: Router,
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this.loadData();
        this.loadMobileData();
        this._wechatPaymentService.successAction.subscribe((result) => {
            this.processPaymentResult(result);
        });
    }

    loadData(): void {
        this._editionSubscriptionService
            .getEditionsForSelect()
            .subscribe((result: EditionsSelectOutput) => {
                this.allFeatures = result.allFeatures;
                this.editionsWithFeatures = result.editionsWithFeatures;
                this.tenantEditionId = result.tenantEditionId;
            })
    }

    showToPayModel(editionId: number, editionPaymentType: CreatePaymentDtoEditionPaymentType, displayName: string): void {
        this.editionOutput.editionId = editionId;
        this.editionOutput.editionsInfo = this.filterEditionData(editionId, editionPaymentType);
        this.editionOutput.editionPaymentType = editionPaymentType;
        this.editionOutput.editionPaymentDisplayName = displayName;
        this.toPayModel.show(this.editionOutput);
    }

    // 获取指定版本的显示名称
    getEditionDisplayName(nameValue: NameValueDto): string {
        let displayName = '';
        this.allFeatures.forEach((element: FlatFeatureSelectDto) => {
            if (element.name === nameValue.name && nameValue.value === '0') {
                displayName = element.displayName + '不限制';
                return;
            }
            if (element.name === nameValue.name && +nameValue.value) {
                displayName = element.displayName + nameValue.value + '个';
                return;
            }
            if (element.name === nameValue.name) {
                displayName = element.displayName;
                return;
            }
        });
        return displayName;
    }

    canTrialEdition(): boolean {
        return this.appSession.canTrialEdition();
    }

    // 试用会员功能
    trialEditionService(editionId: number): void {
        this._editionSubscriptionService
            .trialEdition(editionId)
            .subscribe(result => {
                window.location.reload();
            })
    }

    /*
        @parameter: allEditions、editionPaymentType
        allEditions：拿到所有版本信息
        editionPaymentType：获取支付类型

        将获取到的所有版本数据进行筛查
        1、如果是开通会员，则过滤掉 免费版 的数据
        2、如果是续费会员，则过滤掉 非当前版 的数据
        3、如果是升级会员，则过滤掉 低于且等于当前版本 的数据
    */
    private filterEditionData(editionId: number, editionPaymentType: CreatePaymentDtoEditionPaymentType): EditionWithFeaturesDto[] {
        let allEditions: EditionWithFeaturesDto[] = _.cloneDeep<EditionWithFeaturesDto[]>(this.editionsWithFeatures);
        if (editionPaymentType === PaysType.UpgradeMembership) {
            this.recursionUpgradeQuery(allEditions);
        } else if (editionPaymentType === PaysType.RenewalsMembership) {
            allEditions = this.recursionRenewalsQuery(allEditions);
        } else {
            allEditions.splice(0, 1);
        }
        return allEditions;
    }
    // 升级类型，递归遍历滤掉 低于且等于当前版本 的数据
    private recursionUpgradeQuery(data: EditionWithFeaturesDto[]): EditionWithFeaturesDto[] {
        for (let i = 0; i < data.length; i++) {
            if (!data[i].edition.monthlyPrice || data[i].edition.monthlyPrice <= this.appSession.tenant.edition.monthlyPrice) {
                data.splice(0, i + 1);
                this.recursionUpgradeQuery(data);
            } else {
                continue;
            }
        }
        return data;
    }
    // 续费类型，递归遍历滤掉 低于且等于当前版本 的数据
    private recursionRenewalsQuery(data: EditionWithFeaturesDto[]): EditionWithFeaturesDto[] {
        let allEditions: EditionWithFeaturesDto[] = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].edition.monthlyPrice === this.appSession.tenant.edition.monthlyPrice) {
                allEditions[0] = data[i];
            }
        }
        return allEditions;
    }

    /* 移动端代码 */

    loadMobileData(): void {
        this._editionSubscriptionService
            .getEditionsForSelect()
            .subscribe((result: EditionsSelectOutput) => {
                this.allFeatures = result.allFeatures;
                this.editionsWithFeatures = result.editionsWithFeatures;
                this.initAccountEditionOutput(result);
                this.initCreatePayMent();
            })
    }

    selectTimeHandle(index: number): void {
        this.selectTimeIndex = index;
        this.updatePaymentPeriodType();
        this.createPayment();
    }

    getSelectEdition(edition: EditionWithFeaturesDto): void {
        this.editionOutput.editionsInfo[0] = edition;
        this.editionOutput.editionId = this.createPaymentDto.editionId = edition.edition.id;
        this.updateEditionPaymentType();
        this.createPayment();
    }

    // 立即支付
    toPaysHandle(): void {
        if (!this.additionalData) {
            return;
        }
        this._wechatPaymentService.invokeWeChatPayment(this.additionalData);
    }

    // 初始化前端需要的数据
    private initAccountEditionOutput(result: EditionsSelectOutput): void {
        this.editionOutput.editionsInfo[0] = result.editionsWithFeatures[0];
        this.editionOutput.editionId = result.editionsWithFeatures[0].edition.id;
        this.editionOutput.editionPaymentDisplayName = '';
        this.editionOutput.editionPaymentType = null;
    }

    // 初始化传输后端的数据：时长类型、版本类型、支付方式等等
    private initCreatePayMent(): void {
        this.selectTimeIndex = 3;
        this.createPaymentDto = new CreatePaymentDto();
        this.createPaymentDto.editionId = this.editionsWithFeatures[0].edition.id;
        this.createPaymentDto.subscriptionPaymentGatewayType = CreatePaymentDtoSubscriptionPaymentGatewayType._1;
        this.updatePaymentPeriodType();
        this.updateEditionPaymentType();
        this.createPayment();
    }

    private updatePaymentPeriodType(): void {
        if (this.selectTimeIndex === 1) {
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._365;
        } else if (this.selectTimeIndex === 2) {
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._90;
        } else if (this.selectTimeIndex === 3) {
            this.createPaymentDto.paymentPeriodType = CreatePaymentDtoPaymentPeriodType._30;
        }
    }

    private updateEditionPaymentType(): void {
        if (!this.isWeiXin()) {
            // 非微信用户暂时无法支付,不显示支付页面
            this.cannotPays = true;
            this.notWeChatPaysTips = '移动端暂时只支持微信支付,请前往桌面端进行支付,带来不便请谅解';
            return;
        }
        if (!this.editionOutput.editionsInfo[0].edition.monthlyPrice) {
            // 免费版不显示支付页面
            this.cannotPays = true;
            return;
        }
        if (this.appSession.tenant.edition.monthlyPrice === this.editionOutput.editionsInfo[0].edition.monthlyPrice) {
            this.editionOutput.editionPaymentType = this.createPaymentDto.editionPaymentType = PaysType.RenewalsMembership;
            this.editionOutput.editionPaymentDisplayName = '续费会员';
            this.cannotPays = false;
        } else if (this.appSession.tenant.edition.monthlyPrice < this.editionOutput.editionsInfo[0].edition.monthlyPrice) {
            this.editionOutput.editionPaymentType = this.createPaymentDto.editionPaymentType = PaysType.UpgradeMembership;
            this.editionOutput.editionPaymentDisplayName = '升级会员';
            this.cannotPays = false;
        } else if (this.appSession.tenant.edition.monthlyPrice > this.editionOutput.editionsInfo[0].edition.monthlyPrice) {
            this.cannotPays = true;
        } else if (this.appSession.tenant.isInTrialPeriod || this.appSession.tenant.edition.monthlyPrice === null) {
            this.editionOutput.editionPaymentType = this.createPaymentDto.editionPaymentType = PaysType.JoinMembership;
            this.editionOutput.editionPaymentDisplayName = '开通会员';
            this.cannotPays = false;
        }

    }

    private createPayment(): void {
        if (this.cannotPays) { return; }
        this._paymentService
            .createJsPayment(this.createPaymentDto)
            .subscribe(result => {
                this.additionalData = result.additionalData;
                this.finalPrice = result.amount;
            });
    }

    // 支付回调后支付成功 /失败提示
    private processPaymentResult(result: boolean) {
        if (result) {
            this.message.success('支付成功,为保证正常使用,将会自动刷新本页面');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            this.notify.success('自动失败，请重试');
        }
    }
}
