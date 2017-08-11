
import { Component, OnInit } from '@angular/core';
import { BookingDataStatisticsServiceProxy, BookingDataStatisticsDto, BookingConverRateDto, BookingAccessSourceDto } from 'shared/service-proxies/service-proxies';
import * as moment from 'moment';
@Component({
    selector: 'xiaoyuyue-booking-access-source',
    templateUrl: './booking-access-source.component.html',
    styleUrls: ['./booking-access-source.component.scss']
})
export class BookingAccessSourceComponent implements OnInit {
    resData: object[] = [];
    bookingAccessSourceData: BookingAccessSourceDto[] = [];
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
                            radius: '55%',
                            center: ['50%', '60%'],
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data: (() => {
                                if (this.bookingAccessSourceData.length > 0) {
                                    this.bookingAccessSourceData.forEach((element, index) => {
                                        let res = { value: 0, name: "" };
                                        res.value = element.num;
                                        res.name = element.name;
                                        this.resData.push(res);
                                    });
                                }
                                return this.resData;

                            })(),
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
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

