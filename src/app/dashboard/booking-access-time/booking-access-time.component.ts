import { AfterViewInit, Component, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { BookingAccessChannelDto, BookingAccessSourceDto, BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';
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

export class BookingAccessTimeComponent extends AppComponentBase implements OnChanges {

    @Input()
    bookingAccessTimeData: BookingAccessChannelDto[] = [];

    bookingAccessTimeChartsIntance;
    echartsIntance: any;
    bookingAccessTimeDate: string;
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
        this.bookingAccessTimeChartsIntance = ec;
    }

    initChart(): void {
        this.chartOption = {
            // title: {
            //     // text: '折线图堆叠'
            // },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [this.l('WeChat'), this.l('WeiBo'), this.l('QQ'), this.l('QrCode'), this.l('Other')]
            },
            grid: {
                top: '60px',
                left: '3%',
                right: '4%',
                bottom: '0px',
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
                    const res = [];
                    if (this.bookingAccessTimeData.length > 0) {
                        this.bookingAccessTimeData[0].times.forEach(element => {
                            res.push(element.hour);
                        });
                    }
                    return res;
                })()
            },
            yAxis: {
                type: 'value',
                minInterval: 1
            },
            series: (() => {
                const seriesData = []
                if (this.bookingAccessTimeData.length > 0) {
                    this.bookingAccessTimeData.forEach(element => {
                        const res = new SeriesItem();
                        res.stack = this.l('Total');
                        res.type = 'line';
                        res.name = element.name;
                        element.times.forEach(element => {
                            res.data.push(element.num);
                        });

                        seriesData.push(res);
                    });
                }
                return seriesData;
            })()
        };

        if (this.bookingAccessTimeChartsIntance) {
            this.bookingAccessTimeChartsIntance.setOption(this.chartOption);
        }
    }
}

