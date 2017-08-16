import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { OrgBookingOrderServiceProxy, Gender, Status, BatchComfirmInput, EntityDtoOfInt64, BookingListDto } from 'shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppConsts } from 'shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { GridDataResult, EditEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';

@Component({
    selector: 'xiaoyuyue-booking-custom-model',
    templateUrl: './booking-custom-model.component.html',
    styleUrls: ['./booking-custom-model.component.scss']
})
export class BookingCustomModelComponent extends AppComponentBase implements OnInit {
    bookingItem: BookingListDto = new BookingListDto();
    bookingName: string;
    batchConfirmCount: number = 0;
    confirmOrderText: string = "批处理";
    isBatchConfirmFlag: boolean = false;
    batchComfirmInput: BatchComfirmInput = new BatchComfirmInput();
    isShowModelFlag: boolean = false;
    bookingCustomListData: any;
    status: Status[] = [OrgBookingOrderStatus.State1, OrgBookingOrderStatus.State2, OrgBookingOrderStatus.State3, OrgBookingOrderStatus.State4, OrgBookingOrderStatus.State5];
    creationStartDate: moment.Moment;
    creationEndDate: moment.Moment;

    buttonCount: number = 5;
    info: boolean = true;
    type: 'numeric' | 'input' = 'numeric';
    pageSizes: boolean = false;
    previousNext: boolean = true;
    scrollable: string = "none";

    skipCount: number = 0;
    maxResultCount: number = AppConsts.grid.defaultPageSize;
    sorting: Array<SortDescriptor> = [];
    gender: Gender;
    phoneNumber: string;
    endMinute: number;
    startMinute: number;
    bookingDate: moment.Moment;
    customerName: string;
    bookingId: number;

    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _orgBookingOrderGridDataResult: AppGridData
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingCustomListData = this._orgBookingOrderGridDataResult;
    }

    loadData(): void {
        let state = { skip: this.skipCount, take: this.maxResultCount, sort: this.sorting };
        let maxResultCount, skipCount, sorting;
        if (state) {
            maxResultCount = state.take;
            skipCount = state.skip
            if (state.sort.length > 0 && state.sort[0].dir) {
                sorting = state.sort[0].field + " " + state.sort[0].dir
            }
        }

        let loadOrgConfirmOrderData = () => {
            return this._orgBookingOrderServiceProxy
                .getOrders(
                this.bookingId,
                this.bookingName,
                this.customerName,
                this.bookingDate,
                this.startMinute,
                this.endMinute,
                this.phoneNumber,
                this.gender,
                this.creationStartDate,
                this.creationEndDate,
                this.status,
                sorting,
                maxResultCount,
                skipCount
                ).map(response => {
                    let gridData = (<GridDataResult>{
                        data: response.items,
                        total: response.totalCount
                    });
                    return gridData;
                });
        }

        this._orgBookingOrderGridDataResult.query(loadOrgConfirmOrderData, true);
    }

    public showModel(bookingItem: BookingListDto): void {
        if (!bookingItem) {
            return;
        }
        this.bookingItem = bookingItem;
        this.loadData();
        this.isShowModelFlag = true;
    }

    public hideModel(): void {
        this.isShowModelFlag = false;
        this.isShowModelHander.emit(this.isShowModelFlag);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.skipCount = skip;
        this.maxResultCount = take;
        this.sorting = sort;

        this.loadData();
    }
}
