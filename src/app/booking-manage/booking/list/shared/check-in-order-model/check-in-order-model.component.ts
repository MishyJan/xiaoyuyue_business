import * as _ from 'lodash';

import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BatchCheckInInput, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { BookingOrderStatus } from 'shared/AppEnums';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'xiaoyuyue-check-in-order-model',
    templateUrl: './check-in-order-model.component.html',
    styleUrls: ['./check-in-order-model.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CheckInOrderModelComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    checkInOrderBookingTimePicker: any;
    bookingDate: any;
    batchCheckInInput: BatchCheckInInput = new BatchCheckInInput();
    isFreshenData = false;
    checkInOrderText = this.l('Batch');

    batchCheckInCount = 0;
    bookingId: number;
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(this.appSession);
    isBatchCheckInFlag = false;
    isShowModelFlag = false;
    status: Status[] = [BookingOrderStatus.ConfirmSuccess];
    wait4CheckInOrderListData = new AppGridData();
    searching = false;

    batchCheckIning = false;
    singleCheckInArray = [];

    @ViewChild('checkInOrderModel') modal: ModalDirective;
    @ViewChild('buttonInnerSpan') _buttonInnerSpan: ElementRef;
    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.batchCheckInInput.ids = [];
    }

    ngAfterViewInit() {
        this.initFlatpickr();
    }

    ngOnDestroy(): void {
        if (this.checkInOrderBookingTimePicker) {
            this.checkInOrderBookingTimePicker.destroy();
        }
    }

    loadData(): void {
        this.searching = true;
        this.bookingDate = this.bookingDate ? this.transferUTCZone(this.bookingDate) : undefined;
        const loadOrgCheckInOrderData = () => {
            return this._orgBookingOrderServiceProxy
                .getOrders(
                this.bookingId,
                undefined,
                undefined,
                this.bookingDate,
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
                    this.initCheckInArray(response.items.length);
                    this.singleCheckInArray = new Array();
                    if (typeof this.bookingDate === 'object') {
                        this.bookingDate = this.d(this.bookingDate);
                    }
                    return gridData;
                });
        }

        this.wait4CheckInOrderListData.query(loadOrgCheckInOrderData, true, () => {
            this.batchCheckIning = false;
            this.searching = false;
        });
    }

    initFlatpickr() {
        this.checkInOrderBookingTimePicker = $('#checkInOrderBookingTime').flatpickr({
            'locale': LocalizationHelper.getFlatpickrLocale(),
            onClose: (element) => {
                $(this.checkInOrderBookingTimePicker.input).blur();
            },
            onOpen: (dateObj, dateStr) => {
                this.bookingDate = null;
            }
        })
    }

    // 签到预约订单
    chenkInBookingOrderHandle(bookingOrderId: number, rowIndex: number): void {
        this.batchCheckInInput.ids[0] = bookingOrderId;
        this.singleCheckInArray[rowIndex] = true;
        this._orgBookingOrderServiceProxy
            .batchCheckInBookingOrder(this.batchCheckInInput)
            .finally(() => {
                this.singleCheckInArray[rowIndex] = true;
            })
            .subscribe(() => {
                this.checkInSuccessStatus();
            })
    }

    // 批量签到预约订单
    batchCheckInBookingOrderHandle(): void {
        this.isBatchCheckInFlag = !this.isBatchCheckInFlag;
        this.refeshButtonText();
        if (this.batchCheckInInput.ids.length === 0) {
            return;
        }

        if (!this.isBatchCheckInFlag) {
            this.batchCheckIning = true;
            this._orgBookingOrderServiceProxy
                .batchCheckInBookingOrder(this.batchCheckInInput)
                .finally(() => {
                    this.batchCheckIning = false;
                    this.refeshButtonText();
                })
                .subscribe(() => {
                    this.checkInSuccessStatus();
                })
        }
    }

    // 多选签到预约订单
    batchCheckInBookingOrder(check: boolean, value: number): void {
        if (check) {
            this.batchCheckInInput.ids.push(value);
        } else {
            this.removeByValue(this.batchCheckInInput.ids, value);
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
        this.batchCheckInInput.bookingId = this.bookingId = bookingId;
        this.resetCheckInInitStatus();
        this.modal.show();
        this.loadData();
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;

        this.loadData();
    }

    private checkInSuccessStatus() {
        this.isFreshenData = true;
        this.batchCheckInInput.ids = [];
        this.notify.success(this.l('Booking.CheckIn.Success'));
        this.loadData();
    }

    private resetCheckInInitStatus() {
        this.batchCheckInInput.ids = [];
        this.isBatchCheckInFlag = false;
        this.isFreshenData = false;
        this.refeshButtonText();
    }

    private refeshButtonText() {
        if (!this.isBatchCheckInFlag) {
            this.checkInOrderText = this.l('Batch');
        } else {
            if (this.batchCheckInInput.ids.length === 0) {
                this.checkInOrderText === this.l('Cancel') ? this.checkInOrderText = this.l('Batch') : this.checkInOrderText = this.l('Cancel');
            } else {
                this.checkInOrderText = this.l('Confirm');
            }
        }
        this._buttonInnerSpan.nativeElement.innerHTML = this.checkInOrderText;
    }

    private initCheckInArray(length: number) {
        for (let i = 0; i < length; i++) {
            this.singleCheckInArray[i] = false;
        }
    }
}
