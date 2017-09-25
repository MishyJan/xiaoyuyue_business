import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, BusCenterDataStatisticsDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';
import { NavigationEnd } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [accountModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    mobileDateSelected: string;
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
        // 为移动端单独保存昨日的时间，和PC端不共用一个变量
        this.mobileDateSelected = moment().local().subtract(1, 'days').format('YYYY-MM-DD');
        this.loadData();
        this.getTenantInfo();
    }

    ngAfterViewInit(): void {
        if (this.isMobile()) {
            this.resetHeaderStyle();
            return;
        }
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
        if (!this.isMobile() && this.dateFlatpickr) {
            this.dateFlatpickr.destroy();
        } else {
            this.beforeHeaderStyle();
        }
    }

    resetHeaderStyle(): void {
        $('#fixed-header').css({
            background: 'transparent'
        });

        $('.mobile-page-content').css({
            top: 0
        })
    }

    beforeHeaderStyle(): void {
        $('#fixed-header').css({
            background: 'url("/assets/common/images/booking/header-bg.png") #FF9641'
        });

        $('.mobile-page-content').css({
            top: '55px'
        })
    }

    loadData(): void {
        if (this.isMobile()) {
            this.dateSelected = this.mobileDateSelected;
        }
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

    /* 移动端代码 */
    isMobile(): boolean {
        if ($('.mobile-org-center').length > 0) {
            return true;
        };
        return false;
    }
}