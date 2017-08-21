import * as _ from 'lodash';
import * as moment from 'moment';

import { BatchComfirmInput, BookingListDto, EntityDtoOfInt64, Gender, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { DataStateChangeEvent, EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'xiaoyuyue-booking-custom-model',
    templateUrl: './booking-custom-model.component.html',
    styleUrls: ['./booking-custom-model.component.scss']
})
export class BookingCustomModelComponent extends AppComponentBase implements OnInit {
    batchComfirmInput: BatchComfirmInput = new BatchComfirmInput();
    batchConfirmCount = 0;
    bookingCustomListData = new AppGridData();
    bookingDate: moment.Moment;
    bookingId: number;
    bookingItem: BookingListDto = new BookingListDto();
    bookingName: string;
    confirmOrderText = '批处理';
    creationEndDate: moment.Moment;
    creationStartDate: moment.Moment;
    customerName: string;
    endMinute: number;
    gender: Gender;
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(5, false);
    isBatchConfirmFlag = false;
    isShowModelFlag = false;
    phoneNumber: string;
    startMinute: number;
    status: Status[] = [OrgBookingOrderStatus.State1, OrgBookingOrderStatus.State2, OrgBookingOrderStatus.State3, OrgBookingOrderStatus.State4, OrgBookingOrderStatus.State5];

    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {

    }

    loadData(): void {
        this.bookingCustomListData.query(() => {
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
                this.gridParam.GetSortingString(),
                this.gridParam.MaxResultCount,
                this.gridParam.SkipCount
                ).map(response => {
                    const gridData = (<GridDataResult>{
                        data: response.items,
                        total: response.totalCount
                    });
                    return gridData;
                });
        }, true);
    }

    public showModel(bookingItem: BookingListDto): void {
        if (!bookingItem) { return; }
        this.bookingItem = bookingItem;
        this.loadData();
        this.isShowModelFlag = true;
    }

    public hideModel(): void {
        this.isShowModelFlag = false;
        this.isShowModelHander.emit(this.isShowModelFlag);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;

        this.loadData();
    }
}
