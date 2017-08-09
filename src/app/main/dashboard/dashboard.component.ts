import { Component, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BookingDataStatisticsServiceProxy, BookingDataStatisticsDto, TenantInfoServiceProxy, TenantInfoEditDto } from 'shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { echarts } from 'echarts';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends AppComponentBase implements AfterViewInit {
    tenantBaseInfoData: TenantInfoEditDto;
    bookingDataStatistics: BookingDataStatisticsDto;
    bookingStatisticalDate: moment.Moment;
    constructor(
        injector: Injector,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit(): void { }
    ngOnInit() {
        let date = moment();
        this.bookingStatisticalDate = date.date(date.date() - 1);
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