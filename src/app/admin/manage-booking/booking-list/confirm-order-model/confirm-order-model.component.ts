import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { OrgBookingOrderServiceProxy, Gender, Status, BatchComfirmInput, EntityDtoOfInt64 } from 'shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppConsts } from 'shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { GridDataResult, EditEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';

@Component({
    selector: 'xiaoyuyue-confirm-order-model',
    templateUrl: './confirm-order-model.component.html',
    styleUrls: ['./confirm-order-model.component.scss']
})
export class ConfirmOrderModelComponent extends AppComponentBase implements OnInit {
    bookingName: string;
    batchConfirmCount: number = 0;
    confirmOrderText: string = "批处理";
    isBatchConfirmFlag: boolean = false;
    batchComfirmInput: BatchComfirmInput = new BatchComfirmInput();
    isShowModelFlag: boolean = false;
    wait4ComfirmOrderListData: any;
    status: Status[] = [OrgBookingOrderStatus.State1];
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
        if (this.batchComfirmInput.ids.length == 0) {
            this.confirmOrderText == "取消" ? this.confirmOrderText = "批处理" : this.confirmOrderText = "取消";
            return;
        } else {
            this.confirmOrderText = "确认";
        }

        if (!this.isBatchConfirmFlag) {
            this._orgBookingOrderServiceProxy
                .batchComfirmBookingOrder(this.batchComfirmInput)
                .subscribe(() => {
                    this.confirmOrderText = "批处理";
                    this.batchComfirmInput.ids = [];
                    this.notify.success("确认成功");
                    this.loadData()
                })
        }
    }

    // 批量确认预约订单
    batchComfirmBookingOrder(check: boolean, value: number): void {

        if (check) {
            this.batchComfirmInput.ids.push(value);
            this.confirmOrderText = "确认";
        } else {
            if (this.batchComfirmInput.ids.length <= 1) {
                this.confirmOrderText = "取消";
            }
            this.removeByValue(this.batchComfirmInput.ids, value);
        }
    }

    private removeByValue(arr, val): void {
        arr.forEach((element, index) => {
            if (element == val) {
                arr.splice(index, 1);
                return;
            }
        });
    }

    public showModel(bookingId: number): void {
        if (!bookingId) {
            return;
        }
        this.bookingId = bookingId;
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
