import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { OrgBookingOrderServiceProxy, Gender2, Status2, BatchComfirmInput, EntityDtoOfInt64 } from 'shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppConsts } from 'shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { GridDataResult, EditEvent } from '@progress/kendo-angular-grid';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';

@Component({
    selector: 'xiaoyuyue-confirm-order-model',
    templateUrl: './confirm-order-model.component.html',
    styleUrls: ['./confirm-order-model.component.scss']
})
export class ConfirmOrderModelComponent extends AppComponentBase implements OnInit {
    isBatchConfirmFlag: boolean = false;
    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    batchComfirmInput: BatchComfirmInput = new BatchComfirmInput();
    isShowModelFlag: boolean = false;
    wait4ComfirmOrderListData: AppGridData;
    status: Status2[] = [OrgBookingOrderStatus.State1];
    creationDate: moment.Moment;
    skipCount: number = 0;
    maxResultCount: number = AppConsts.grid.defaultPageSize;
    sorting: Array<SortDescriptor> = [];
    gender: Gender2;
    phoneNumber: string;
    endMinute: number;
    startMinute: number;
    bookingDate: moment.Moment;
    customerName: string;
    bookingId: number;

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _orgConfirmOrderGridDataResult: AppGridData
    ) {
        super(injector);
    }

    ngOnInit() {
        this.wait4ComfirmOrderListData = this._orgConfirmOrderGridDataResult;
        this.batchComfirmInput.ids = [];
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
                .getOrders2Booking(
                this.bookingId,
                this.customerName,
                this.bookingDate,
                this.startMinute,
                this.endMinute,
                this.phoneNumber,
                this.gender,
                this.creationDate,
                this.status,
                sorting,
                maxResultCount,
                skipCount
                ).map(response => {
                    let gridData = (<GridDataResult>{
                        data: response.bookingOrders.items,
                        total: response.bookingOrders.totalCount
                    });
                    return gridData;
                });
        }

        this._orgConfirmOrderGridDataResult.query(loadOrgConfirmOrderData, true);
    }

    // 确认预约订单
    comfirmBookingOrderHander(confirmBookingId: number): void {
        let input: EntityDtoOfInt64 = new EntityDtoOfInt64();
        input.id = confirmBookingId;
        this._orgBookingOrderServiceProxy
            .comfirmBookingOrder(input)
            .subscribe(() => {
                this.notify.success("确认成功");
                this.loadData()
            })
    }

    batchComfirmBookingOrderHandler(): void {
        this.isBatchConfirmFlag = !this.isBatchConfirmFlag;
        if (!this.isBatchConfirmFlag) {
            this._orgBookingOrderServiceProxy
                .batchComfirmBookingOrder(this.batchComfirmInput)
                .subscribe(() => {
                    this.notify.success("确认成功");
                    this.loadData()
                })
        }
    }

    // 批量确认预约订单
    batchComfirmBookingOrder(check: boolean, value: number): void {

        if (check) {
            this.batchComfirmInput.ids.push(value);
        } else {
            this.batchComfirmInput.ids = this.batchComfirmInput.ids.filter((ele, index) => {
                return ele != value;
            })
        }
    }

    showModel(bookingId: number): void {
        if (!bookingId) {
            return;
        }
        this.bookingId = bookingId;
        this.loadData();
        this.isShowModelFlag = true;
    }

    hideModel(): void {
        this.isShowModelFlag = false;
        this.isShowModelHander.emit(this.isShowModelFlag);
    }
}
