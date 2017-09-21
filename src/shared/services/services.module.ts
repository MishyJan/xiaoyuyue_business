import { BreadcrumbService } from './bread-crumb.service';
import { CookiesService } from './cookies.service';
import { GetUserForEditService } from './get-user-info.service';
import { HostSettingService } from './get-host-settings.service';
import { NgModule } from '@angular/core';
import { TenantService } from './tenant.service';
import { TitleService } from 'shared/services/title.service';

@NgModule({
    providers: [
        HostSettingService,
        GetUserForEditService,
        TenantService,
        BreadcrumbService,
        CookiesService,
        TitleService
    ]
})
export class ServicesModule { }
