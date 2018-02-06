import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AccountEditionBuild } from 'app/shared/utils/account-edition';
import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from 'shared/animations/routerTransition';
import { EditionSubscriptionServiceProxy, EditionsSelectOutput, EditionWithFeaturesDto, FlatFeatureSelectDto, NameValueDto } from 'shared/service-proxies/service-proxies';
import { ToPayModelComponent } from 'app/editions/list/to-pay-model/to-pay-model.component';
import { GetCurrentFeatures } from 'shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-editions-list',
    templateUrl: './editions-list.component.html',
    styleUrls: ['./editions-list.component.scss'],
    animations: [accountModuleAnimation()]
})
export class EditionsListComponent extends AppComponentBase implements OnInit {
    allFeatures: FlatFeatureSelectDto[];
    tenantEditionId: number;
    editionsWithFeatures: EditionWithFeaturesDto[];
    accountEdition: AccountEditionBuild = new AccountEditionBuild();
    @ViewChild('toPayModel') toPayModel: ToPayModelComponent;
    constructor(
        private injector: Injector,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this.loadData();
    }

    showToPayModel(editionId: number): void {
        this.toPayModel.show(editionId);
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

}