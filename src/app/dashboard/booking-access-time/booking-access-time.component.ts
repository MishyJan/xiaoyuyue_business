import { AfterViewInit, Component, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { BookingAccessChannelDto, BookingAccessSourceDto, BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';
import { element } from 'protractor';

export class SeriesItem {
    name: string;
    type: string;
    stack: string;
    smooth: boolean;
    data: number[] = [];
}

@Component({
    selector: 'xiaoyuyue-booking-access-time',
    templateUrl: './booking-access-time.component.html',
    styleUrls: ['./booking-access-time.component.scss']
})

export class BookingAccessTimeComponent extends AppComponentBase implements AfterViewInit, OnChanges {

    @Input()
    bookingAccessTimeData: BookingAccessChannelDto[] = [];

    bookingAccessTimeCharts;
    echartsIntance: any;
    bookingAccessTimeDate: string;
    chartOption: object = {};
    count = 0;
    showloading = true;
    slogan: string = '暂无数据';

    constructor(
        injector: Injector,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
        super(injector);
    }

    ngAfterViewInit() {
        this.setOption();
    }
    
    ngOnChanges() {
        this.initChart();
    }

    onChartInit(ec) {
        this.bookingAccessTimeCharts = ec;
    }

    setOption(): void {
        if (this.bookingAccessTimeCharts) {
            this.bookingAccessTimeCharts.setOption(this.chartOption);
            this.bookingAccessTimeCharts.hideLoading();
        }
    }

    initChart(): void {
        this.chartOption = {
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
                type: 'value',
                minInterval: 1
            },
            series: (() => {
                let seriesData = []
                if (this.bookingAccessTimeData.length > 0) {
                    this.bookingAccessTimeData.forEach(element => {
                        let res = new SeriesItem();
                        res.type = 'line';
                        res.name = element.name;
                        res.smooth = true;
                        element.times.forEach(element => {
                            res.data.push(element.num);
                        });

                        seriesData.push(res);
                    });
                }
                return seriesData;
            })()
        };

        this.setOption();
    }
}

