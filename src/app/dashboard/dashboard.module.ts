import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

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
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ResponsiveModule } from 'ng2-responsive';
import { ServicesModule } from 'shared/services/services.module';
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
        NgxEchartsModule,
        DropDownsModule,
        ResponsiveModule,
        ServicesModule
    ],
    declarations: [
        DashboardComponent,
        BookingDateStatisticsComponent,
        BookingAccessSourceComponent,
        BookingAccessTimeComponent,
        BookingSaturationComponent,
        BookingHeatComponent,
        BookingAccessRegionComponent,
    ],
    providers: [
    ]
})
export class DashboardModule { }