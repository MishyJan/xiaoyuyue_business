import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CreatePaymentDtoEditionPaymentType, EditionSubscriptionServiceProxy, EditionWithFeaturesDto, EditionsSelectOutput, FlatFeatureSelectDto, NameValueDto } from 'shared/service-proxies/service-proxies';

import { AccountEditionBuild } from 'app/shared/utils/account-edition';
import { AppComponentBase } from 'shared/common/app-component-base';
import { GetCurrentFeatures } from 'shared/AppConsts';
import { Router } from '@angular/router';
import { ToPayModelComponent } from 'app/editions/list/to-pay-model/to-pay-model.component';
import { accountModuleAnimation } from 'shared/animations/routerTransition';

export class EditionOutput {
    editionsInfo: EditionWithFeaturesDto[];
    editionId: number;
    editionPaymentType: CreatePaymentDtoEditionPaymentType;
}

@Component({
    selector: 'xiaoyuyue-editions-list',
    templateUrl: './editions-list.component.html',
    styleUrls: ['./editions-list.component.scss'],
    animations: [accountModuleAnimation()]
})
export class EditionsListComponent extends AppComponentBase implements OnInit {
    editionOutput: EditionOutput = new EditionOutput();
    allFeatures: FlatFeatureSelectDto[];
    tenantEditionId: number;
    editionsWithFeatures: EditionWithFeaturesDto[];
    accountEdition: AccountEditionBuild = new AccountEditionBuild();
    @ViewChild('toPayModel') toPayModel: ToPayModelComponent;
    constructor(
        private injector: Injector,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy,
        private _router: Router,
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this.loadData();
    }

    showToPayModel(editionId: number, editionPaymentType: CreatePaymentDtoEditionPaymentType): void {
        this.editionOutput.editionId = editionId;
        this.editionOutput.editionsInfo = this.editionsWithFeatures.slice(1); // 移除免费版的数据
        this.editionOutput.editionPaymentType = editionPaymentType;
        this.toPayModel.show(this.editionOutput);
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

    // 获取指定版本的显示名称
    getEditionDisplayName(nameValue: NameValueDto): string {
        let displayName = '';
        this.allFeatures.forEach((element: FlatFeatureSelectDto) => {
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

    redirectToPay() {
        this._router.navigate(['/editions/pays']);
    }
}
