import { AfterViewInit, Component, Injector, ViewEncapsulation } from '@angular/core';
import { BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements AfterViewInit {
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

    ngAfterViewInit(): void { }
    ngOnInit() {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        this.bookingStatisticalDate = this.dateToString(date);
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

    dateToString(date: Date): string {
        let temp = '';
        if (date instanceof Date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            temp = `${year}-${month}-${day}`;
        }

        return temp;
    }

    getTenantInfo(): void {
        this._tenantInfoServiceProxy
            .getTenantInfoForEdit()
            .subscribe(result => {
                this.tenantBaseInfoData = result;
            });
    }
}