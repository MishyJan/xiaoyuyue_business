import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BookingAccessSourceDto, BookingConverRateDto, BookingDataStatisticsDto, BookingDataStatisticsServiceProxy, GetBookingSaturationOutput, OutletServiceServiceProxy, SelectListItemDto } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { LocalStorageService } from 'shared/utils/local-storage.service';
import { Moment } from 'moment';

@Component({
    selector: 'xiaoyuyue-booking-saturation',
    templateUrl: './booking-saturation.component.html',
    styleUrls: ['./booking-saturation.component.scss']
})
export class BookingSaturationComponent extends AppComponentBase implements OnInit, AfterViewInit {
    bookingStatisticsData: GetBookingSaturationOutput = new GetBookingSaturationOutput();
    outletDefaultListItem: any;
    outletSelectListData: SelectListItemDto[];
    resData: object[] = [];
    bookingStatisticsDate: string;
    chartOption: object = {};
    count = 0;
    showloading = true;

    constructor(
        injector: Injector,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy,
        private _localStorageService: LocalStorageService
    ) {
        super(injector);
    }

    ngOnInit() {
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() - 1); // TODO: 写死测试
        this.bookingStatisticsDate = this.dateToString(date);
        this.getOutletSelectListData();
    }

    ngAfterViewInit() {
    }

    loadData(): void {
        this.showloading = true;
        this._bookingDataStatisticsServiceProxy
            .getBookingSaturation(this.outletDefaultListItem, this.bookingStatisticsDate)
            .finally(() => { this.showloading = false })
            .subscribe((result) => {
                this.bookingStatisticsData = result;
            })
    }

    getOutletSelectListData(): void {
        this._localStorageService.getItem(AppConsts.outletSelectListCache, () => {
            return this._outletServiceServiceProxy.getOutletSelectList()
        }).then(result => {
            // 添加请选择数据源
            this.outletDefaultListItem = result[0].value;
            this.outletSelectListData = result;
            this.loadData();
        });
    }

    outletSelectListDataChangeHandler(result): void {
        this.outletDefaultListItem = result;
        this.loadData();
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

    public getSaturationValue(val1, val2): string {
        if (val2 === 0) {
            return '0%';
        }
        const temp = val1 / val2 * 100
        return Math.round(temp) + '%';
    }
}

