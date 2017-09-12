import { AppStorageService } from './storage.service';
import { BreadcrumbService } from './bread-crumb.service';
import { GetUserForEditService } from './get-user-info.service';
import { HostSettingService } from './get-host-settings.service';
import { NgModule } from '@angular/core';
import { TenantService } from './tenant.service';

@NgModule({
    providers: [
        AppStorageService,
        HostSettingService,
        GetUserForEditService,
        TenantService,
        BreadcrumbService,
    ]
})
export class ServicesModule { }
