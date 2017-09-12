import { BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy } from 'shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnChanges } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { Moment } from 'moment';

@Component({
    selector: 'xiaoyuyue-booking-date-statistics',
    templateUrl: './booking-date-statistics.component.html',
    styleUrls: ['./booking-date-statistics.component.scss']
})
export class BookingDateStatisticsComponent extends AppComponentBase implements OnChanges {
    @Input()
    bookingStatisticalData: BookingConverRateDto[] = [];

    bookingStatisticalChartsIntance;
    bookingStatisticalDate: string;
    chartOption: object = {};
    count = 0;
    showloading = true;

    constructor(
        injector: Injector,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
        super(injector);
    }

    ngOnChanges() {
        this.initChart();
    }

    onChartInit(ec) {
        this.bookingStatisticalChartsIntance = ec;
    }

    initChart(): void {
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
                data: [this.l('Booking.ResponderNumber'), this.l('Dashboard.AccessNum')]
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
                left: '8%',
                right: '4%',
                bottom: '0px',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    name: this.l('Source'),
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
                    name: this.l('Booking.ResponderNumber'),
                    boundaryGap: false,
                    minInterval: 1
                },
                {
                    type: 'value',
                    scale: true,
                    name: this.l('Dashboard.AccessNum'),
                    minInterval: 1,
                    boundaryGap: false
                }
            ],
            series: [
                {
                    name: this.l('Dashboard.AccessNum'),
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
                    name: this.l('Booking.ResponderNumber'),
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

        if (this.bookingStatisticalChartsIntance) {
            this.bookingStatisticalChartsIntance.setOption(this.chartOption);
        }
    }
}
