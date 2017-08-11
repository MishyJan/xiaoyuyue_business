import { Component, OnInit } from '@angular/core';
import { BookingDataStatisticsServiceProxy, BookingDataStatisticsDto, BookingConverRateDto, BookingAccessSourceDto, OutletServiceServiceProxy, SelectListItemDto, OrgBookingServiceProxy, BookingHeatDto } from 'shared/service-proxies/service-proxies';
import * as moment from 'moment';
@Component({
    selector: 'xiaoyuyue-booking-heat',
    templateUrl: './booking-heat.component.html',
    styleUrls: ['./booking-heat.component.scss']
})
export class BookingHeatComponent implements OnInit {
    bookingHeatData: BookingHeatDto[];
    bookingId: number;
    orgBookingSelectListData: SelectListItemDto[];
    orgBookingDefaultListItem: string;
    chartOption: object = {};
    count: number = 0;
    showloading: boolean = true;

    constructor(
        private _orgBookingServiceProxy: OrgBookingServiceProxy,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
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
                        bottom: '60px',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: (() => {
                                let res = [];
                                this.bookingHeatData.forEach(element => {
                                    res.push(element.hourOfDay);
                                });
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
                            name: '时间热度',
                            type: 'bar',
                            barWidth: '20px',
                            data: (() => {
                                let res = [];
                                this.bookingHeatData.forEach(element => {
                                    res.push(element.bookingOrderNum);
                                });
                                return res;
                            })(),
                        }
                    ]
                };


            })
    }

    getBookingSelectListData(): void {
        this._orgBookingServiceProxy
            .getBookingSelectList()
            .subscribe(result => {
                this.orgBookingDefaultListItem = result[0].value;
                this.bookingId = +this.orgBookingDefaultListItem;
                this.orgBookingSelectListData = result;
                this.loadData();
            });
    }

    orgBookingSelectListDataChangeHandler(result): void {
        this.bookingId = result;
        this.loadData();
    }
}

