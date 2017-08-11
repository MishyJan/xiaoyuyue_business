import { Component, OnInit } from '@angular/core';
import { BookingDataStatisticsServiceProxy, BookingDataStatisticsDto, BookingConverRateDto } from 'shared/service-proxies/service-proxies';
import * as moment from 'moment';
@Component({
    selector: 'xiaoyuyue-booking-date-statistics',
    templateUrl: './booking-date-statistics.component.html',
    styleUrls: ['./booking-date-statistics.component.scss']
})
export class BookingDateStatisticsComponent implements OnInit {
    bookingStatisticalData: BookingConverRateDto[] = [];
    bookingStatisticalDate: string;
    chartOption: object = {};
    count: number = 0;
    showloading: boolean = true;

    constructor(
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
    }

    ngOnInit() {
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() - 1);
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
                    dataZoom: {
                        show: false,
                        start: 0,
                        end: 100
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            name: '渠道',
                            nameLocation: 'start',
                            data: (() => {
                                let res = [];
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
                            max: 50,
                            min: 0,
                            boundaryGap: [0.2, 0.2]
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '访问量',
                            max: 500,
                            min: 0,
                            boundaryGap: [0.2, 0.2]
                        }
                    ],
                    series: [
                        {
                            name: '访问量',
                            type: 'bar',
                            xAxisIndex: 0,
                            yAxisIndex: 1,
                            data: (() => {
                                let res = [];
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
                                let res = [];
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
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            temp = `${year}-${month}-${day}`;
        }
        return temp;
    }
}
