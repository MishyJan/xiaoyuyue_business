import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, BusCenterDataStatisticsDto, CurrentlyBookingDataDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';
import { NavigationEnd } from '@angular/router';
import { appModuleAnimation } from 'shared/animations/routerTransition';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    currentlyBookingData: CurrentlyBookingDataDto[] = [];
    forSevenDaysOptions: object = {};
    tabToggle = true;
    mobileDateSelected: string;
    tenantBaseInfoData: TenantInfoEditDto;
    dataStatistics: BusCenterDataStatisticsDto;
    dateSelected: string;
    dateFlatpickr;
    showloading = true;
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
            this.getCurrentlyBookingData();
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
            'background-image': 'none',
            'background-color': 'transparent'
        });

        $('.mobile-page-content').css({
            top: 0
        });
    }

    beforeHeaderStyle(): void {
        $('#fixed-header').css({
            'background-image': 'url("/assets/common/images/booking/header-bg.png")',
            'background-color': '#FF9641'
        });

        $('.mobile-page-content').css({
            top: '55px'
        });
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
    switchTabs(falg: boolean): void {
        this.tabToggle = falg;
    }

    // 获取近七天应约人数统计数据
    getCurrentlyBookingData(): void {
        this.showloading = true;
        this._bookingDataStatisticsServiceProxy
            .getCurrentlyBookingData()
            .finally(() => { this.showloading = false; })
            .subscribe(result => {
                this.currentlyBookingData = result;
                this.initForSevenDaysEcharts();
            })
    }

    // 初始化echarts
    initForSevenDaysEcharts(): void {
        this.forSevenDaysOptions = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20%',
                containLabel: true
            },
            // toolbox: {
            //     feature: {
            //         saveAsImage: {}
            //     }
            // },
            color: ['#FF9641'],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                minInterval: 1,
                data: (() => {
                    const res = [];
                    if (this.currentlyBookingData.length > 0) {
                        this.currentlyBookingData.forEach((element, index) => {
                            res.push(element.date);
                        });
                    }
                    return res;
                })()
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    name: '近七天统计量',
                    type: 'line',
                    stack: '统计量',
                    smooth: true,
                    data: (() => {
                        const res = [];
                        if (this.currentlyBookingData.length > 0) {
                            this.currentlyBookingData.forEach((element, index) => {
                                res.push(element.bookingNum);
                            });
                        }
                        return res;
                    })()
                }
            ]
        };

    }

    isMobile(): boolean {
        if ($('.mobile-org-center').length > 0) {
            return true;
        };
        return false;
    }
}