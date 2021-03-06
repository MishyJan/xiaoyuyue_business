import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { ModalModule, PopoverModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

import { AppCommonModule } from 'app/shared/common/app-common.module';
import { BookingOrderInfoModelComponent } from './info-model/booking-order-info-model.component';
import { BookingOrderListComponent } from './booking-order-list.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './booking-order-routing.module';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ResponsiveModule } from 'ng2-responsive'
import { UtilsModule } from '@shared/utils/utils.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),

        CustomerRoutingModule,
        UtilsModule,
        AppCommonModule,
        GridModule,
        DropDownsModule,
        ButtonsModule,
        DialogModule,
        DateInputModule,
        ResponsiveModule,
        InfiniteScrollModule
    ],
    declarations: [
        BookingOrderListComponent,
        BookingOrderInfoModelComponent,
    ],
    providers: [

    ]
})
export class BookingOrderModule { }