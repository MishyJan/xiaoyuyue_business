import * as _ from 'lodash';

import { BatchConfirmInput, EntityDtoOfInt64, Gender, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataStateChangeEvent, EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppGridData } from '@shared/grid-data-results/grid-data-results';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { ModalDirective } from 'ngx-bootstrap';
import { Moment } from 'moment';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'xiaoyuyue-confirm-order-model',
    templateUrl: './confirm-order-model.component.html',
    styleUrls: ['./confirm-order-model.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmOrderModelComponent extends AppComponentBase implements OnInit {
    isFreshenData = false;
    hourOfDay: string;
    confirmOrderText = this.l('Batch');

    batchConfirmInput: BatchConfirmInput = new BatchConfirmInput();
    batchConfirmCount = 0;
    bookingDate: Moment;
    bookingId: number;
    bookingName: string;
    creationEndDate: Moment;
    creationStartDate: Moment;
    customerName: string;
    endMinute: number;
    gender: Gender;
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(5, false);
    isBatchConfirmFlag = false;
    isShowModelFlag = false;
    phoneNumber: string;
    startMinute: number;
    status: Status[] = [OrgBookingOrderStatus.WaitConfirm];
    wait4ConfirmOrderListData: any;

    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('confirmOrderModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _orgConfirmOrderGridDataResult: AppGridData
    ) {
        super(injector);
    }

    ngOnInit() {
        this.wait4ConfirmOrderListData = this._orgConfirmOrderGridDataResult;
        this.batchConfirmInput.ids = [];
    }

    loadData(): void {
        const loadOrgConfirmOrderData = () => {
            return this._orgBookingOrderServiceProxy
                .getOrders(
                this.bookingId,
                this.bookingName,
                this.customerName,
                this.bookingDate,
                this.hourOfDay,
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
        }

        this._orgConfirmOrderGridDataResult.query(loadOrgConfirmOrderData, true);
    }

    // 确认预约订单
    confirmBookingOrderHander(confirmBookingId: number): void {
        const input: EntityDtoOfInt64 = new EntityDtoOfInt64();
        input.id = confirmBookingId;
        this._orgBookingOrderServiceProxy
            .confirmBookingOrder(input)
            .subscribe(() => {
                this.notify.success(this.l('Booking.Confirm.Success'));
                this.isFreshenData = true;
                this.loadData()
            })
    }

    batchConfirmBookingOrderHandler(): void {

        this.isBatchConfirmFlag = !this.isBatchConfirmFlag;
        if (this.batchConfirmInput.ids.length === 0) {
            this.confirmOrderText === this.l('Cancel') ? this.confirmOrderText = this.l('Batch') : this.confirmOrderText = this.l('Cancel');
            return;
        } else {
            this.confirmOrderText = this.l('Confirm');
        }

        if (!this.isBatchConfirmFlag) {
            this._orgBookingOrderServiceProxy
                .batchConfirmBookingOrder(this.batchConfirmInput)
                .subscribe(() => {
                    this.confirmOrderText = this.l('Batch');
                    this.batchConfirmInput.ids = [];
                    this.notify.success(this.l('Booking.Confirm.Success'));
                    this.isFreshenData = true;
                    this.loadData()
                })
        }
    }

    // 批量确认预约订单
    batchConfirmBookingOrder(check: boolean, value: number): void {

        if (check) {
            this.batchConfirmInput.ids.push(value);
            this.confirmOrderText = this.l('Confirm');
        } else {
            if (this.batchConfirmInput.ids.length <= 1) {
                this.confirmOrderText = this.l('Cancel');
            }
            this.removeByValue(this.batchConfirmInput.ids, value);
        }
    }

    private removeByValue(arr, val): void {
        arr.forEach((element, index) => {
            if (element === val) {
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
        this.modal.show();
        this.loadData();
        this.isFreshenData = false;
    }

    public hideModel(): void {
        this.modal.hide();
        this.isShowModelHander.emit(this.isFreshenData);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;

        this.loadData();
    }
}
