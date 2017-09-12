import { AfterViewInit, Component, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { BookingAccessRegionDto, BookingAccessSourceDto, BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Moment } from 'moment';

export class BookingAccessRegion {
    name: string;
    value: number;
}

@Component({
    selector: 'xiaoyuyue-booking-access-region',
    templateUrl: './booking-access-region.component.html',
    styleUrls: ['./booking-access-region.component.scss']
})
export class BookingAccessRegionComponent extends AppComponentBase implements OnChanges {

    @Input()
    bookingAccessRegionData: BookingAccessRegionDto[];
    bookingAccessRegionChart;
    resData: object[] = [];
    bookingAccessRegionDate: string;
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
        this.bookingAccessRegionChart = ec;
    }

    initChart(): void {
        this.chartOption = {
            title: {
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            visualMap: {
                min: 0,
                max: 2500,
                left: 'left',
                top: 'top',
                text: [this.l('High'), this.l('Low')],           // 文本，默认为数值文本
                calculable: true
            },
            series: [
                {
                    name: this.l('Dashboard.AccessRegion'),
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: (() => {
                        const res = [];

                        if (this.bookingAccessRegionData.length > 0) {
                            this.bookingAccessRegionData.forEach(element => {
                                const item = new BookingAccessRegion();
                                item.name = element.name;
                                item.value = element.num;
                                res.push(item);
                            });
                        } else {
                            res.push(new BookingAccessRegion());
                        }
                        return res;
                    })(),
                },
            ]
        };

        if (this.bookingAccessRegionChart) {
            this.bookingAccessRegionChart.setOption(this.chartOption);
            this.bookingAccessRegionChart.resize();
        }
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

