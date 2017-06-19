import { Injectable, Injector, Input } from '@angular/core';
import { CommonLookupServiceProxy, ComboboxItemDto, TenantServiceProxy, TenantEditDto, UpdateTenantFeaturesInput, GetTenantFeaturesForEditOutput, EntityDto } from "shared/service-proxies/service-proxies";
import { AppServiceBase } from "shared/services/base.service";
import { ActivatedRoute, Params } from "@angular/router";

@Injectable()
export class TenantService extends AppServiceBase {
    tenantFeatures: GetTenantFeaturesForEditOutput;
    currentConnectionString: string;
    tenant: TenantEditDto;
    editions: ComboboxItemDto[];

    @Input()
    userId: number;

    constructor(
        injector: Injector,
        private _commonLookupService: CommonLookupServiceProxy,
        private route: ActivatedRoute,
        private _tenantService: TenantServiceProxy,
    ) {
        super(injector);

    }

    /**
     * 获取版本信息
     */
    getEditionsForCombobox() {
        this._commonLookupService
            .getEditionsForCombobox()
            .subscribe(result => {
                this.editions = result.items;
                let notSelectedEdition = new ComboboxItemDto();
                notSelectedEdition.displayText = this.l('NotAssigned');
                notSelectedEdition.value = '0';
                this.editions.unshift(notSelectedEdition);
            })
    }

    /**
     * 获取租户详细信息
     */
    getTenantForEdit(userId: number) {
        if (!userId) {
            return;
        }
        return this._tenantService
            .getTenantForEdit(userId)
            .toPromise()
            .then(result => {
                this.tenant = result.tenant;
                this.tenantFeatures = result.features;
                this.currentConnectionString = result.tenant.connectionString;
            });
    }

    /**
     * 更新租户详细信息
     */
    updateTenant(input: TenantEditDto) {
        this.tenant.editionId = +this.tenant.editionId || null;
        this.tenant.features = input.features;
        this._tenantService
            .updateTenant(this.tenant)
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
            });
    }

    /**
     * 重置租户特性
     */
    resetTenantSpecificFeatures(input: EntityDto) {
        this._tenantService
            .resetTenantSpecificFeatures(input)
            .subscribe(() => {
                this.notify.info(this.l('ResetSuccessfully'));
            });
    }
}