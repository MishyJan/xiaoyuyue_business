import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, BusCenterDataStatisticsDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    tenantBaseInfoData: TenantInfoEditDto;
    dataStatistics: BusCenterDataStatisticsDto;
    dateSelected: string;
    dateFlatpickr;
    constructor(
        injector: Injector,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.dateSelected = moment().local().subtract(1, 'days').format('YYYY-MM-DD');
        this.loadData();
        this.getTenantInfo();
    }

    ngAfterViewInit(): void {
        this.dateFlatpickr = $('.flatpickr').flatpickr({
            'locale': 'zh',
            wrap: true,
            defaultDate: this.dateSelected,
            maxDate: this.dateSelected,
            onChange: (selectedDates, dateStr, instance) => {
                this.dateSelected = moment(new Date(selectedDates)).local().format('YYYY-MM-DD');
                this.loadData();
            }
        });
    }

    ngOnDestroy() {
        this.dateFlatpickr.destroy();
    }

    loadData(): void {
        this._bookingDataStatisticsServiceProxy
            .getBusCenterDataStatistics(this.dateSelected)
            .subscribe((result) => {
                this.dataStatistics = result;
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