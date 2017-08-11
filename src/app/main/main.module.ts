import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';

import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { MainRoutingModule } from './main-routing.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AngularEchartsModule } from 'ngx-echarts';
import { BookingDateStatisticsComponent } from './dashboard/booking-date-statistics/booking-date-statistics.component';
import { BookingAccessSourceComponent } from './dashboard/booking-access-source/booking-access-source.component';
import { BookingAccessTimeComponent } from './dashboard/booking-access-time/booking-access-time.component';
import { BookingSaturationComponent } from './dashboard/booking-saturation/booking-saturation.component';
import { BookingHeatComponent } from './dashboard/booking-heat/booking-heat.component';
import { BookingAccessRegionComponent } from './dashboard/booking-access-region/booking-access-region.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        GridModule,
        AngularEchartsModule,
        DropDownsModule
    ],
    declarations: [
        DashboardComponent,
        BookingDateStatisticsComponent,
        BookingAccessSourceComponent,
        BookingAccessTimeComponent,
        BookingSaturationComponent,
        BookingHeatComponent,
        BookingAccessRegionComponent
    ]
})
export class MainModule { }