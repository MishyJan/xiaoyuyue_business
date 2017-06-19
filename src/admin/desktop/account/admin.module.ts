import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ModalModule, TabsModule, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import { AdminRoutingModule } from './admin-routing.module'
import { UtilsModule } from '@shared/utils/utils.module'
import { AppCommonModule } from '@admin/shared/common/app-common.module'

import { HostSettingsComponent } from './settings/host-settings.component'
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { AppStorageService } from "shared/services/storage.service";
import { HostSettingService } from "shared/services/get-host-settings.service";
import { GetUserForEdit } from "shared/services/get-user-info.service";
import { TenantService } from "shared/services/tenant.service";
import { SmsSettingComponent } from './settings/host-settings/sms-setting/sms-setting.component';

import { DialogModule } from '@progress/kendo-angular-dialog';
import { SMSTemplateServiceProxy, OrganizationBookingServiceProxy, PictureServiceProxy, OutletServiceServiceProxy } from "shared/service-proxies/service-proxies";
import { DatePickerModule, DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { UploadPictureModelComponent } from './create-or-edit-booking/picture-manage/upload-picture-model/upload-picture-model.component';

import { UserManagementComponent } from "admin/desktop/account/settings/host-settings/user-management/user-management.component";
import { TenantManagementComponent } from "admin/desktop/account/settings/host-settings/tenant-management/tenant-management.component";
import { SecurityComponent } from "admin/desktop/account/settings/host-settings/security/security.component";
import { EmailSmtpComponent } from "admin/desktop/account/settings/host-settings/email-smtp/email-smtp.component";
import { LoginSettingComponent } from "admin/desktop/account/settings/host-settings/login-setting/login-setting.component";
import { GeneralInfoComponent } from "admin/desktop/account/settings/host-settings/general-info/general-info.component";
import { CreateOrEditBookingComponent } from "admin/desktop/account/create-or-edit-booking/create-or-edit-booking.component";
import { BaseInfoComponent } from "admin/desktop/account/create-or-edit-booking/base-info/base-info.component";
import { PictureManageComponent } from "admin/desktop/account/create-or-edit-booking/picture-manage/picture-manage.component";
import { TimeInfoComponent } from "admin/desktop/account/create-or-edit-booking/time-info/time-info.component";
import { TenantSettingsComponent } from "admin/desktop/account/settings/tenant-settings.component";


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
        HostSettingsComponent,
        
        UserManagementComponent,
        TenantManagementComponent,
        SecurityComponent,
        EmailSmtpComponent,
        LoginSettingComponent,
        GeneralInfoComponent,
        SmsSettingComponent,
        CreateOrEditBookingComponent,
        BaseInfoComponent,
        PictureManageComponent,
        TimeInfoComponent,
        ManageBookingComponent,
        UploadPictureModelComponent,
        TenantSettingsComponent 
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
export class AdminModule { }