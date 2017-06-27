import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { ModalModule, TabsModule, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import { AdminRoutingModule } from './admin-routing.module'
import { UtilsModule } from '@shared/utils/utils.module'
import { AppCommonModule } from '@app/shared/common/app-common.module'

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
import { SMSTemplateServiceProxy, OrganizationBookingServiceProxy, PictureServiceProxy, OutletServiceServiceProxy, BookingServiceProxy } from "shared/service-proxies/service-proxies";
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { UploadPictureModelComponent } from './create-or-edit-booking/picture-manage/upload-picture-model/upload-picture-model.component';

import { UserManagementComponent } from "app/admin/settings/host-settings/user-management/user-management.component";
import { TenantManagementComponent } from "app/admin/settings/host-settings/tenant-management/tenant-management.component";
import { SecurityComponent } from "app/admin/settings/host-settings/security/security.component";
import { EmailSmtpComponent } from "app/admin/settings/host-settings/email-smtp/email-smtp.component";
import { LoginSettingComponent } from "app/admin/settings/host-settings/login-setting/login-setting.component";
import { GeneralInfoComponent } from "app/admin/settings/host-settings/general-info/general-info.component";
import { CreateOrEditBookingComponent } from "app/admin/create-or-edit-booking/create-or-edit-booking.component";
import { BaseInfoComponent } from "app/admin/create-or-edit-booking/base-info/base-info.component";
import { PictureManageComponent } from "app/admin/create-or-edit-booking/picture-manage/picture-manage.component";
import { TimeInfoComponent } from "app/admin/create-or-edit-booking/time-info/time-info.component";
import { TenantSettingsComponent } from "app/admin/settings/tenant-settings.component";
import { QRCodeModule } from 'angular2-qrcode';
import { ShareBookingModelComponent } from './create-or-edit-booking/share-booking-model/share-booking-model.component';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

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
DateInputModule,
        QRCodeModule
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
        TenantSettingsComponent,
        ShareBookingModelComponent 
    ],
    providers: [
        AppStorageService,
        HostSettingService,
        GetUserForEdit,
        TenantService,
        SMSTemplateServiceProxy,
        OrganizationBookingServiceProxy,
        PictureServiceProxy,
        OutletServiceServiceProxy,
        BookingServiceProxy
    ]
})
export class AdminModule { }