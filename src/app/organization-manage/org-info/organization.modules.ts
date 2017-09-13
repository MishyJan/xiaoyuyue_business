import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppCommonModule } from 'app/shared/common/app-common.module';
import { CommonModule } from '@angular/common';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns/dist/es/main';
import { ModalModule, } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { OrgInfoComponent } from './org-info.component';
import { OrganizationRoutingModule } from './organization-routing.module';
import { ResponsiveModule } from 'ng2-responsive'
import { UploadOrgBgComponent } from './upload-bg/upload-bg.component';
import { UploadOrgLogoComponent } from './upload-logo/upload-logo.component';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ModalModule.forRoot(),
        OrganizationRoutingModule,
        UtilsModule,
        AppCommonModule,
        DropDownsModule,
        ResponsiveModule
    ],
    declarations: [
        OrgInfoComponent,
        UploadOrgLogoComponent,
        UploadOrgBgComponent,
    ],
    providers: [

    ]
})
export class OrganizationModule { }