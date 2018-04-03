import { AfterViewInit, Component, Injector, Input, OnChanges } from '@angular/core';
import { BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, GetBookingAccessSourceOutput } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';

@Component({
    selector: 'xiaoyuyue-booking-access-source',
    templateUrl: './booking-access-source.component.html',
    styleUrls: ['./booking-access-source.component.scss']
})
export class BookingAccessSourceComponent extends AppComponentBase implements AfterViewInit, OnChanges {
    @Input()
    bookingAccessSourceData: GetBookingAccessSourceOutput = new GetBookingAccessSourceOutput();
    bookingAccessSourceChart;
    bookingAccessSourceDate: string;
    chartOption: object = {};
    count = 0;
    showloading = true;

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
        this.bookingAccessSourceChart = ec;
    }

    setOption(): void {
        if (this.bookingAccessSourceChart) {
            this.bookingAccessSourceChart.setOption(this.chartOption);
            this.bookingAccessSourceChart.hideLoading();
        }
    }

    initChart(): void {
        this.chartOption = {
            title: {
                // text: '访问来源',
                // subtext: '纯属虚构',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            grid: {
                top: '60px',
                left: '3%',
                right: '4%',
                bottom: '0px',
                containLabel: true
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: '10px',
                data: [this.l('WeChat'), this.l('WeiBo'), this.l('QQ'), this.l('QrCode'), this.l('Other')]
            },
            series: [
                {
                    name: this.l('Dashboard.AccessSource'),
                    type: 'pie',
                    radius: '75%',
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
                            return [{ value: 0, name: this.l('NoData') }];
                        } else if (this.bookingAccessSourceData.channels.length > 0) {
                            const resData = [];
                            this.bookingAccessSourceData.channels.forEach((element, index) => {
                                const res = { value: 0, name: '' };
                                res.value = element.num;
                                res.name = element.name;
                                resData.push(res);
                            });
                            return resData;
                        }
                    })(),
                    itemStyle: {
                        normal: {
                            color: (() => {
                                if (this.bookingAccessSourceData.subAccessNum <= 0) {
                                    return 'rgba(0, 0, 0, 0.5)';
                                }
                            })(),
                        }
                    }
                }
            ]
        };

        this.setOption();
    }
}

