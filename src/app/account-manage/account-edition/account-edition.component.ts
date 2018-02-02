import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AccountEditionBuild } from 'app/shared/utils/account-edition';
import { AppComponentBase } from 'shared/common/app-component-base';
import { ToPayModelComponent } from 'app/account-manage/account-edition/to-pay-model/to-pay-model.component';
import { accountModuleAnimation } from 'shared/animations/routerTransition';
import { EditionSubscriptionServiceProxy, EditionsSelectOutput, EditionWithFeaturesDto, FlatFeatureSelectDto } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'xiaoyuyue-account-edition',
    templateUrl: './account-edition.component.html',
    styleUrls: ['./account-edition.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountEditionComponent extends AppComponentBase implements OnInit {
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
                console.log(result);
                this.allFeatures = result.allFeatures;
                this.editionsWithFeatures = result.editionsWithFeatures;
                this.tenantEditionId = result.tenantEditionId;
            })
    }

    // 获取指定版本的显示名称
    getEditionDisplayName(name: string): string {
        let displayName = '';
        this.allFeatures.forEach((element: FlatFeatureSelectDto) => {
            if (element.name === name) {
                displayName = element.displayName;
                return;
            }
        });
        return displayName;
    }

}
