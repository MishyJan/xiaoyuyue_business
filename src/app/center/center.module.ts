import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule, TabsModule, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import { UtilsModule } from '@shared/utils/utils.module'

import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { AppStorageService } from "shared/services/storage.service";
import { HostSettingService } from "shared/services/get-host-settings.service";
import { GetUserForEdit } from "shared/services/get-user-info.service";
import { TenantService } from "shared/services/tenant.service";

import { DialogModule } from '@progress/kendo-angular-dialog';
import { SMSTemplateServiceProxy, OrganizationBookingServiceProxy, PictureServiceProxy, OutletServiceServiceProxy } from "shared/service-proxies/service-proxies";
import { DatePickerModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { AppCommonModule } from "app/shared/common/app-common.module";
import { AdminRoutingModule } from "app/center/center-routing.module";
import { CenterComponent } from "app/center/center.component";
import { MainUserComponent } from "app/center/main-user/main-user.component";



@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),

        AdminRoutingModule,
        UtilsModule,
        AppCommonModule,
        GridModule,
        DropDownsModule,
        ButtonsModule,
        SharedModule,
        DialogModule,

        DatePickerModule,
        DateInputsModule,
    ],
    declarations: [
        CenterComponent,
        MainUserComponent
    ],
    providers: [
        AppStorageService,
        HostSettingService,
        GetUserForEdit,
        TenantService,
        SMSTemplateServiceProxy,
        OrganizationBookingServiceProxy,
        PictureServiceProxy,
        OutletServiceServiceProxy
    ]
})
export class CenterModule { }