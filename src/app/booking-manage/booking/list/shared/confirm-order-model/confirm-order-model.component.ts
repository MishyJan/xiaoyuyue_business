import * as _ from 'lodash';

import { BatchConfirmInput, EntityDtoOfInt64, Gender, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataStateChangeEvent, EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppGridData } from '@shared/grid-data-results/grid-data-results';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { BookingOrderStatus } from 'shared/AppEnums';
import { ModalDirective } from 'ngx-bootstrap';
import { Moment } from 'moment';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'xiaoyuyue-confirm-order-model',
    templateUrl: './confirm-order-model.component.html',
    styleUrls: ['./confirm-order-model.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ConfirmOrderModelComponent extends AppComponentBase implements OnInit {
    isFreshenData = false;
    confirmOrderText = this.l('Batch');

    batchConfirmInput: BatchConfirmInput = new BatchConfirmInput();
    batchConfirmCount = 0;
    bookingId: number;
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(this.appSession);
    isBatchConfirmFlag = false;
    isShowModelFlag = false;
    status: Status[] = [BookingOrderStatus.WaitConfirm];
    wait4ConfirmOrderListData = new AppGridData();

    batchConfirming = false;
    singleConfirmingArray = [];

    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('confirmOrderModel') modal: ModalDirective;
    @ViewChild('buttonInnerSpan') _buttonInnerSpan: ElementRef;

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.batchConfirmInput.ids = [];
    }

    loadData(): void {
        const loadOrgConfirmOrderData = () => {
            return this._orgBookingOrderServiceProxy
                .getOrders(
                this.bookingId,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                this.status,
                this.gridParam.GetSortingString(),
                this.gridParam.MaxResultCount,
                this.gridParam.SkipCount
                ).map(response => {
                    const gridData = (<GridDataResult>{
                        data: response.items,
                        total: response.totalCount
                    });
                    this.initConfirmingArray(response.items.length);
                    this.singleConfirmingArray = new Array
                    return gridData;
                });
        }

        this.wait4ConfirmOrderListData.query(loadOrgConfirmOrderData, true, () => {
            this.batchConfirming = false;
        });
    }

    // 确认预约订单
    confirmBookingOrderHander(confirmBookingId: number, rowIndex: number): void {
        const input: EntityDtoOfInt64 = new EntityDtoOfInt64();
        input.id = confirmBookingId;
        this.singleConfirmingArray[rowIndex] = true;
        this._orgBookingOrderServiceProxy
            .confirmBookingOrder(input)
            .finally(() => {
                this.singleConfirmingArray[rowIndex] = true;
            })
            .subscribe(() => {
                this.confirmSuccessStatus();
            })
    }

    batchConfirmBookingOrderHandler(): void {
        this.isBatchConfirmFlag = !this.isBatchConfirmFlag;
        this.refeshButtonText();
        if (this.batchConfirmInput.ids.length === 0) {
            return;
        }

        if (!this.isBatchConfirmFlag) {
            this.batchConfirming = true;
            this._orgBookingOrderServiceProxy
                .batchConfirmBookingOrder(this.batchConfirmInput)
                .finally(() => {
                    this.batchConfirming = false;
                    this.refeshButtonText();
                })
                .subscribe(() => {
                    this.confirmSuccessStatus();
                })
        }
    }

    // 批量确认预约订单
    batchConfirmBookingOrder(check: boolean, value: number): void {
        if (check) {
            this.batchConfirmInput.ids.push(value);
        } else {
            this.removeByValue(this.batchConfirmInput.ids, value);
        }
        this.refeshButtonText();
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
        this.resetConfirmInitStatus();
        this.modal.show();
        this.loadData();
    }

    public hideModel(): void {
        this.isShowModelHander.emit(this.isFreshenData);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;

        this.loadData();
    }

    confirmSuccessStatus() {
        this.isFreshenData = true;
        this.batchConfirmInput.ids = [];
        this.notify.success(this.l('Booking.Confirm.Success'));
        this.loadData()
    }

    resetConfirmInitStatus() {
        this.batchConfirmInput.ids = [];
        this.isBatchConfirmFlag = false;
        this.isFreshenData = false;
        this.refeshButtonText();
    }

    refeshButtonText() {
        if (!this.isBatchConfirmFlag) {
            this.confirmOrderText = this.l('Batch');
        } else {
            if (this.batchConfirmInput.ids.length === 0) {
                this.confirmOrderText === this.l('Cancel') ? this.confirmOrderText = this.l('Batch') : this.confirmOrderText = this.l('Cancel');
            } else {
                this.confirmOrderText = this.l('Confirm');
            }
        }
        this._buttonInnerSpan.nativeElement.innerHTML = this.confirmOrderText;
    }

    initConfirmingArray(length: number) {
        for (let i = 0; i < length; i++) {
            this.singleConfirmingArray[i] = false;
        }
    }
}