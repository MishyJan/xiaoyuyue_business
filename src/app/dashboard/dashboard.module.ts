import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

import { AngularEchartsModule } from 'ngx-echarts';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { BookingAccessRegionComponent } from './booking-access-region/booking-access-region.component';
import { BookingAccessSourceComponent } from './booking-access-source/booking-access-source.component';
import { BookingAccessTimeComponent } from './booking-access-time/booking-access-time.component';
import { BookingDateStatisticsComponent } from './booking-date-statistics/booking-date-statistics.component';
import { BookingHeatComponent } from './booking-heat/booking-heat.component';
import { BookingSaturationComponent } from './booking-saturation/booking-saturation.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgModule } from '@angular/core';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        DashboardRoutingModule,
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
export class DashboardModule { }