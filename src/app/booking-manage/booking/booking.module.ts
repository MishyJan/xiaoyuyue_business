import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { ModalModule, PopoverModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

import { AppCommonModule } from 'app/shared/common/app-common.module';
import { BookingCustomModelComponent } from './list/shared/booking-custom-model/booking-custom-model.component';
import { BookingDetailComponent } from './list/booking-detail/booking-detail.component';
import { BookingListComponent } from './list/booking-list.component';
import { BookingRoutingModule } from './booking-routing.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { ConfirmOrderModelComponent } from './list/shared/confirm-order-model/confirm-order-model.component';
import { CreateOrEditBookingComponent } from './create-or-edit/create-or-edit-booking.component';
import { CreateSucceededComponent } from './create-or-edit/create-succeeded/create-succeeded.component';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridDataResultsModule } from 'shared/grid-data-results/grid-result.modules';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MobileConfirmOrderModelComponent } from './list/shared/mobile-confirm-order-model/mobile-confirm-order-model.component';
import { MobileShareBookingModelComponent } from './list/shared/mobile-share-booking-model/share-booking-model.component';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { PictureManageComponent } from 'app/booking-manage/booking/create-or-edit/picture-manage/picture-manage.component';
import { QRCodeModule } from 'angular2-qrcode';
import { ResponsiveModule } from 'ng2-responsive';
import { ShareBookingModelComponent } from 'app/booking-manage/booking/create-or-edit/share-booking-model/share-booking-model.component';
import { TimeInfoComponent } from 'app/booking-manage/booking/create-or-edit/time-info/time-info.component';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),

        BookingRoutingModule,
        UtilsModule,
        AppCommonModule,
        GridModule,
        DropDownsModule,
        ButtonsModule,
        SharedModule,
        DialogModule,
        DateInputModule,
        QRCodeModule,
        NgxPaginationModule,
        GridDataResultsModule,
        ResponsiveModule,
        InfiniteScrollModule
    ],
    declarations: [
        PictureManageComponent,
        TimeInfoComponent,
        BookingListComponent,
        ShareBookingModelComponent,
        CreateOrEditBookingComponent,
        ConfirmOrderModelComponent,
        BookingCustomModelComponent,
        CreateSucceededComponent,
        BookingDetailComponent,
        MobileShareBookingModelComponent,
        MobileConfirmOrderModelComponent
    ],
    providers: [

    ]
})
export class BookingModule { }