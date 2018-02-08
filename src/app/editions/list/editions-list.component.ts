import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from 'shared/animations/routerTransition';
import { EditionSubscriptionServiceProxy, EditionsSelectOutput, EditionWithFeaturesDto, FlatFeatureSelectDto, NameValueDto, CreatePaymentDtoEditionPaymentType } from 'shared/service-proxies/service-proxies';
import { ToPayModelComponent } from 'app/editions/list/to-pay-model/to-pay-model.component';
import { GetCurrentFeatures } from 'shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { Router } from '@angular/router';
import { AccountEditionOutput } from 'app/shared/utils/account-edition';
import { PaysType } from 'shared/AppEnums';
import * as _ from 'lodash';

@Component({
    selector: 'xiaoyuyue-editions-list',
    templateUrl: './editions-list.component.html',
    styleUrls: ['./editions-list.component.scss'],
    animations: [accountModuleAnimation()]
})
export class EditionsListComponent extends AppComponentBase implements OnInit {
    editionOutput: AccountEditionOutput = new AccountEditionOutput();
    allFeatures: FlatFeatureSelectDto[];
    tenantEditionId: number;
    editionsWithFeatures: EditionWithFeaturesDto[];
    @ViewChild('toPayModel') toPayModel: ToPayModelComponent;
    constructor(
        private injector: Injector,
        private _router: Router,
        private _sessionService: AppSessionService,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this.loadData();
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
            if (element.name === nameValue.name && nameValue.value === '[Unlimited]') {
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
        return this._sessionService.canTrialEdition();
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
            if (!data[i].edition.monthlyPrice || data[i].edition.monthlyPrice <= this._sessionService.tenant.edition.monthlyPrice) {
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
            if (data[i].edition.monthlyPrice === this._sessionService.tenant.edition.monthlyPrice) {
                allEditions[0] = data[i];
            }
        }
        return allEditions;
    }

}
