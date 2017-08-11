import { Component, OnInit } from '@angular/core';
import { BookingDataStatisticsServiceProxy, BookingDataStatisticsDto, BookingConverRateDto, BookingAccessSourceDto, BookingAccessChannelDto } from 'shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { element } from 'protractor';

export class SeriesItem {
    name: string;
    type: string;
    stack: string;
    data: number[] = [];
}

@Component({
    selector: 'xiaoyuyue-booking-access-time',
    templateUrl: './booking-access-time.component.html',
    styleUrls: ['./booking-access-time.component.scss']
})

export class BookingAccessTimeComponent implements OnInit {
    seriesData: SeriesItem[] = [];
    bookingAccessTimeData: BookingAccessChannelDto[] = [];
    bookingAccessTimeDate: string;
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
        this.bookingAccessTimeDate = this.dateToString(date);
        this.loadData();
    }

    ngAfterViewInit() {
    }


    loadData(): void {
        this.showloading = true;
        this._bookingDataStatisticsServiceProxy
            .getBookingAccessTime(this.bookingAccessTimeDate)
            .finally(() => { this.showloading = false })
            .subscribe((result) => {
                this.bookingAccessTimeData = result;
                this.chartOption = {
                    // title: {
                    //     // text: '折线图堆叠'
                    // },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['微信', '微博', 'QQ', '二维码', '其他']
                    },
                    grid: {
                        top: '60px',
                        left: '3%',
                        right: '4%',
                        bottom: '60px',
                        containLabel: true
                    },
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: (() => {
                            let res = [];
                            if (this.bookingAccessTimeData.length > 0) {
                                this.bookingAccessTimeData[0].times.forEach(element => {
                                    res.push(element.hour);
                                });
                            }
                            return res;
                        })()
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: (() => {
                        if (this.bookingAccessTimeData.length > 0) {
                            this.bookingAccessTimeData.forEach(element => {
                                let res = new SeriesItem();
                                res.stack = "总量";
                                res.type = "line";
                                res.name = element.name;
                                element.times.forEach(element => {
                                    res.data.push(element.num);
                                });

                                this.seriesData.push(res);
                            });
                        }
                        return this.seriesData;
                    })(),
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

