import { Component, OnInit } from '@angular/core';
import { BookingDataStatisticsServiceProxy, BookingDataStatisticsDto, BookingConverRateDto, BookingAccessSourceDto, OutletServiceServiceProxy, SelectListItemDto, GetBookingSaturationOutput } from 'shared/service-proxies/service-proxies';
import * as moment from 'moment';
@Component({
    selector: 'xiaoyuyue-booking-saturation',
    templateUrl: './booking-saturation.component.html',
    styleUrls: ['./booking-saturation.component.scss']
})
export class BookingSaturationComponent implements OnInit {
    bookingStatisticsData: GetBookingSaturationOutput = new GetBookingSaturationOutput();
    outletDefaultListItem: any;
    outletSelectListData: SelectListItemDto[];
    resData: object[] = [];
    bookingStatisticsDate: string;
    chartOption: object = {};
    count: number = 0;
    showloading: boolean = true;

    constructor(
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _bookingDataStatisticsServiceProxy: BookingDataStatisticsServiceProxy
    ) {
    }

    ngOnInit() {
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() - 1); //TODO: 写死测试
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
        this._outletServiceServiceProxy
            .getOutletSelectList()
            .subscribe(result => {
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
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            temp = `${year}-${month}-${day}`;
        }
        return temp;
    }

    public getSaturationValue(val1, val2): string {
        let temp = val1 / val2 * 100
        return Math.round(temp) + '%';
    }
}

