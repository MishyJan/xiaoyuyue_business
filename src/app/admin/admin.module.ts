import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule, TabsModule, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import { AdminRoutingModule } from './admin-routing.module'
import { UtilsModule } from '@shared/utils/utils.module'
import { AppCommonModule } from '@app/shared/common/app-common.module'

import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { AppStorageService } from "shared/services/storage.service";
import { HostSettingService } from "shared/services/get-host-settings.service";
import { GetUserForEdit } from "shared/services/get-user-info.service";
import { TenantService } from "shared/services/tenant.service";

import { DialogModule } from '@progress/kendo-angular-dialog';
import { SMSTemplateServiceProxy, OrgBookingServiceProxy, PictureServiceProxy, OutletServiceServiceProxy, BookingServiceProxy, StateServiceServiceProxy, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';
import { QRCodeModule } from 'angular2-qrcode';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { CreateOrEditBookingComponent } from './manage-booking/create-or-edit-booking/create-or-edit-booking.component';
import { BaseInfoComponent } from './manage-booking/create-or-edit-booking/base-info/base-info.component';
import { PictureManageComponent } from './manage-booking/create-or-edit-booking/picture-manage/picture-manage.component';
import { TimeInfoComponent } from './manage-booking/create-or-edit-booking/time-info/time-info.component';
import { BookingListComponent } from './manage-booking/booking-list/booking-list.component';
import { UploadPictureModelComponent } from './manage-booking/create-or-edit-booking/picture-manage/upload-picture-model/upload-picture-model.component';
import { ShareBookingModelComponent } from './manage-booking/create-or-edit-booking/share-booking-model/share-booking-model.component';
import { CreateOrEditOutletComponent } from './manage-org/create-or-edit-outlet/create-or-edit-outlet.component';
import { OutletListComponent } from './manage-org/outlet-list/outlet-list.component';
import { OrgInfoComponent } from './manage-org/org-info/org-info.component';
import { OutletImageComponent } from './manage-org/create-or-edit-outlet/outlet-image/outlet-image.component';
import { ContactInfoComponent } from './manage-org/create-or-edit-outlet/contact-info/contact-info.component';
import { UploadPictureNoneGalleryComponent } from './shared/upload-picture-none-gallery/upload-picture-none-gallery.component';
import { UploadOrgLogoComponent } from './manage-org/org-info/upload-org-logo/upload-org-logo.component';
import { UploadOrgBgComponent } from './manage-org/org-info/upload-org-bg/upload-org-bg.component';
import { PaginationComponent } from './shared/pagination/pagination.component';

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
        CreateOrEditBookingComponent,
        BaseInfoComponent,
        PictureManageComponent,
        TimeInfoComponent,
        BookingListComponent,
        UploadPictureModelComponent,
        ShareBookingModelComponent,
        CreateOrEditOutletComponent,
        OutletListComponent,
        OrgInfoComponent,
        OutletImageComponent,
        ContactInfoComponent,
        UploadPictureNoneGalleryComponent,
        UploadOrgLogoComponent,
        UploadOrgBgComponent,
        PaginationComponent
    ],
    providers: [
        AppStorageService,
        HostSettingService,
        GetUserForEdit,
        TenantService,
        SMSTemplateServiceProxy,
        OrgBookingServiceProxy,
        PictureServiceProxy,
        OutletServiceServiceProxy,
        BookingServiceProxy,
        StateServiceServiceProxy,
        TenantInfoServiceProxy
    ]
})
export class AdminModule { }