import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BookingAccessRegionDto, BookingAccessSourceDto, BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';

export class BookingAccessRegion {
    name: string;
    value: number;
}

@Component({
    selector: 'xiaoyuyue-booking-access-region',
    templateUrl: './booking-access-region.component.html',
    styleUrls: ['./booking-access-region.component.scss']
})
export class BookingAccessRegionComponent extends AppComponentBase implements OnInit, AfterViewInit {
    bookingAccessRegionEchartsData: BookingAccessRegion = new BookingAccessRegion();
    bookingAccessRegionData: BookingAccessRegionDto[];
    resData: object[] = [];
    bookingAccessRegionDate: string;
    chartOption: object = {};
    count = 0;
    showloading = true;

    constructor(
        injector: Injector,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() - 1);
        this.bookingAccessRegionDate = this.dateToString(date);
        this.loadData();
    }

    ngAfterViewInit() {
    }

    loadData(): void {
        this.showloading = true;
        this._bookingDataStatisticsServiceProxy
            .getBookingAccessRegion(this.bookingAccessRegionDate)
            .finally(() => { this.showloading = false })
            .subscribe((result) => {
                this.bookingAccessRegionData = result;

                this.chartOption = {
                    title: {
                        // text: 'iphone销量',
                        // subtext: '纯属虚构',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    // legend: {
                    //     orient: 'vertical',
                    //     left: 'left',
                    //     data: ['iphone3', 'iphone4', 'iphone5']
                    // },
                    visualMap: {
                        min: 0,
                        max: 2500,
                        left: 'left',
                        top: 'top',
                        text: ['高', '低'],           // 文本，默认为数值文本
                        calculable: true
                    },
                    // toolbox: {
                    //     show: true,
                    //     orient: 'vertical',
                    //     left: 'right',
                    //     top: 'center',
                    //     feature: {
                    //         dataView: { readOnly: false },
                    //         restore: {},
                    //         saveAsImage: {}
                    //     }
                    // },
                    series: [
                        {
                            name: '访问人分布',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: (() => {
                                const res = [];
                                this.bookingAccessRegionData.forEach(element => {
                                    this.bookingAccessRegionEchartsData = new BookingAccessRegion();
                                    this.bookingAccessRegionEchartsData.name = element.name;
                                    this.bookingAccessRegionEchartsData.value = element.num;
                                    res.push(this.bookingAccessRegionEchartsData);
                                });
                                return res;
                            })(),
                            // data: [
                            //     { name: '北京', value: Math.round(Math.random() * 1000) },
                            // ]
                        },
                    ]
                };

                if (result.length <= 0) {
                    const myChart = echarts.init(document.getElementById('bookingAccessRegionEcharts'));
                    myChart.setOption(this.chartOption);
                }

            })
    }

    dateToString(date: Date): string {
        let temp = '';
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            temp = `${year}-${month}-${day}`;
        }
        return temp;
    }

}

