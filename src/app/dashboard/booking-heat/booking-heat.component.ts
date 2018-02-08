import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BookingAccessSourceDto, BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, BookingHeatDto, OrgBookingServiceProxy, OutletServiceServiceProxy, SelectListItemDto } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { LocalStorageService } from 'shared/utils/local-storage.service';
import { Moment } from 'moment';

@Component({
    selector: 'xiaoyuyue-booking-heat',
    templateUrl: './booking-heat.component.html',
    styleUrls: ['./booking-heat.component.scss']
})
export class BookingHeatComponent extends AppComponentBase implements OnInit, AfterViewInit {
    bookingHeatData: BookingHeatDto[] = [];
    bookingId: number;
    orgBookingSelectListData: SelectListItemDto[] = [];
    orgBookingDefaultListItem: string;
    chartOption: object = {};
    count = 0;
    showloading = true;
    slogan = this.l('NoData');

    constructor(
        injector: Injector,
        private _orgBookingServiceProxy: OrgBookingServiceProxy,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy,
        private _localStorageService: LocalStorageService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getBookingSelectListData();
    }

    ngAfterViewInit() {
    }

    loadData(): void {
        this.showloading = true;
        this._bookingDataStatisticsServiceProxy
            .getBookingHeat(this.bookingId)
            .finally(() => { this.showloading = false })
            .subscribe((result) => {
                this.bookingHeatData = result;

                this.chartOption = {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        top: '60px',
                        left: '3%',
                        right: '4%',
                        bottom: '0px',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: (() => {
                                const res = [];
                                if (this.bookingHeatData.length > 0) {
                                    this.bookingHeatData.forEach(element => {
                                        res.push(element.hourOfDay);
                                    });
                                } else {
                                    res.push(this.l('NoData'));
                                }
                                return res;
                            })(),
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: this.l('Dashboard.BookingHeat'),
                            type: 'bar',
                            barWidth: '20px',
                            itemStyle: {
                                normal: {
                                    color: '#FF9641'
                                }
                            },
                            data: (() => {
                                const res = [];
                                if (this.bookingHeatData.length > 0) {
                                    this.bookingHeatData.forEach(element => {
                                        res.push(element.bookingOrderNum);
                                    });
                                } else {
                                    res.push(0);
                                }
                                return res;
                            })(),
                        }
                    ]
                };

                if (this.bookingHeatData.length <= 0) {
                    const myChart = echarts.init(document.getElementById('bookingAccessHeatEcharts'));
                    myChart.setOption(this.chartOption);
                }
            })
    }

    getBookingSelectListData(): void {
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.bookingSelectListCache, this.appSession.tenantId), () => {
            return this._orgBookingServiceProxy.getBookingSelectList()
        }).then(result => {
            // 添加请选择数据源
            if (result.length > 0) {
                this.orgBookingDefaultListItem = result[0].value;
                this.bookingId = +this.orgBookingDefaultListItem;
                this.orgBookingSelectListData = result;
                this.loadData();
            } else {
                this.orgBookingSelectListData = [];
                this.showloading = false;
            }
        })
        // .catch(error => {
        //     debugger;
        // });
    }

    orgBookingSelectListDataChangeHandler(result): void {
        this.bookingId = result;
        this.loadData();
    }
}