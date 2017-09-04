import { AfterViewInit, Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
    tenantBaseInfoData: TenantInfoEditDto;
    bookingDataStatistics: BookingDataStatisticsDto;
    bookingStatisticalDate: string;
    constructor(
        injector: Injector,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        $('.flatpickr').flatpickr({
            wrap: true,
            defaultDate: this.bookingStatisticalDate,
            maxDate: this.bookingStatisticalDate,
            onChange: (selectedDates, dateStr, instance) => {
                this.bookingStatisticalDate = moment(new Date(selectedDates)).local().format('YYYY-MM-DD');
                this.loadData();
            }
        })
    }
    ngOnInit() {
        this.bookingStatisticalDate = moment().local().subtract(1, 'days').format('YYYY-MM-DD');
        this.loadData();
        this.getTenantInfo();
    }

    loadData(): void {
        this._bookingDataStatisticsServiceProxy
            .getBookingData(this.bookingStatisticalDate)
            .subscribe((result) => {
                this.bookingDataStatistics = result;
            });
    }

    getTenantInfo(): void {
        this._tenantInfoServiceProxy
            .getTenantInfoForEdit()
            .subscribe(result => {
                this.tenantBaseInfoData = result;
            });
    }
}