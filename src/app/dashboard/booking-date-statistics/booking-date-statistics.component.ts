import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy } from 'shared/service-proxies/service-proxies';

import { Moment } from 'moment';

@Component({
    selector: 'xiaoyuyue-booking-date-statistics',
    templateUrl: './booking-date-statistics.component.html',
    styleUrls: ['./booking-date-statistics.component.scss']
})
export class BookingDateStatisticsComponent implements OnInit, AfterViewInit {
    bookingStatisticalData: BookingConverRateDto[] = [];
    bookingStatisticalDate: string;
    chartOption: object = {};
    count = 0;
    showloading = true;

    constructor(
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
    }

    ngOnInit() {
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() - 2);
        this.bookingStatisticalDate = this.dateToString(date);
        this.loadData();
    }

    ngAfterViewInit() {

        // this.count = 11;
        // setInterval(() => {
        //     var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');

        //     var data0 = this.chartOption.series[0].data;
        //     var data1 = this.chartOption.series[1].data;
        //     data0.shift();
        //     data0.push(Math.round(Math.random() * 1000));
        //     data1.shift();
        //     data1.push((Math.random() * 10 + 5).toFixed(1));

        //     this.chartOption.xAxis[0].data.shift();
        //     this.chartOption.xAxis[0].data.push(axisData);
        //     this.chartOption.xAxis[1].data.shift();
        //     this.chartOption.xAxis[1].data.push(this.count++);

        //     myChart.setOption(this.chartOption);
        // }, 2100);
    }

    loadData(): void {
        this.showloading = true;
        this._bookingDataStatisticsServiceProxy
            .getBookingConverRate(this.bookingStatisticalDate)
            .finally(() => { this.showloading = false })
            .subscribe((result) => {
                this.bookingStatisticalData = result;
                this.chartOption = {
                    title: {
                        // text: '应约人数',
                        // subtext: ''
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}'
                    },
                    legend: {
                        data: ['应约人数', '访问量']
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            dataView: { readOnly: false },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        top: '60px',
                        left: '3%',
                        right: '4%',
                        bottom: '60px',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            name: '渠道',
                            nameLocation: 'start',
                            data: (() => {
                                const res = [];
                                if (this.bookingStatisticalData.length > 0) {
                                    this.bookingStatisticalData.forEach((element, index) => {
                                        res.push(element.name);
                                    });
                                }
                                return res;
                            })()
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '应约人数',
                            boundaryGap: false
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '访问量',
                            boundaryGap: false
                        }
                    ],
                    series: [
                        {
                            name: '访问量',
                            type: 'bar',
                            xAxisIndex: 0,
                            yAxisIndex: 1,
                            data: (() => {
                                const res = [];
                                if (this.bookingStatisticalData.length > 0) {
                                    this.bookingStatisticalData.forEach((element, index) => {
                                        res.push(element.accessNum);
                                    });
                                }
                                return res;
                            })()
                        },
                        {
                            name: '应约人数',
                            type: 'line',
                            data: (() => {
                                const res = [];
                                if (this.bookingStatisticalData.length > 0) {
                                    this.bookingStatisticalData.forEach((element, index) => {
                                        res.push(element.bookingOrderNum);
                                    });
                                }
                                return res;
                            })()
                        }
                    ]
                };
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
