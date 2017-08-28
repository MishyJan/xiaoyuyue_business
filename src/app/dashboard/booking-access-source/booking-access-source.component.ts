import { BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, GetBookingAccessSourceOutput } from 'shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';

import { Moment } from 'moment';

@Component({
    selector: 'xiaoyuyue-booking-access-source',
    templateUrl: './booking-access-source.component.html',
    styleUrls: ['./booking-access-source.component.scss']
})
export class BookingAccessSourceComponent implements OnInit {
    resData: object[] = [];
    bookingAccessSourceData: GetBookingAccessSourceOutput = new GetBookingAccessSourceOutput();
    bookingAccessSourceDate: string;
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
        // this.bookingAccessSourceDate = moment(date);
        this.bookingAccessSourceDate = this.dateToString(date);
        this.loadData();
    }

    ngAfterViewInit() {
    }


    loadData(): void {
        this.showloading = true;
        this._bookingDataStatisticsServiceProxy
            .getBookingAccessSource(this.bookingAccessSourceDate)
            .finally(() => { this.showloading = false })
            .subscribe((result) => {
                this.bookingAccessSourceData = result;

                this.chartOption = {
                    title: {
                        // text: '访问来源',
                        // subtext: '纯属虚构',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    grid: {
                        top: '60px',
                        left: '3%',
                        right: '4%',
                        bottom: '60px',
                        containLabel: true
                    },
                    legend: {
                        orient: 'horizontal',
                        left: 'left',
                        data: ['微信', 'QQ', '微博', '二维码', '其他']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '84%',
                            center: ['50%', '50%'],
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: (() => {
                                if (this.bookingAccessSourceData.subAccessNum <= 0) {
                                    return [{ value: 0, name: "暂无数据" }];

                                } else if (this.bookingAccessSourceData.channels.length > 0) {
                                    this.bookingAccessSourceData.channels.forEach((element, index) => {
                                        let res = { value: 0, name: "" };
                                        res.value = element.num;
                                        res.name = element.name;
                                        this.resData.push(res);
                                    });
                                    return this.resData;
                                }
                            })(),
                            itemStyle: {
                                normal: {
                                    color: (() => {
                                        if (this.bookingAccessSourceData.subAccessNum <= 0) {
                                            return "rgba(0, 0, 0, 0.5)";
                                        }
                                    })(),
                                }
                                // emphasis: {
                                //     shadowBlur: 10,
                                //     shadowOffsetX: 0,
                                //     shadowColor: 'rgba(0, 0, 0, 0.5)'
                                // }
                            }
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
