import * as _ from 'lodash';

import { BatchConfirmInput, EntityDtoOfInt64, Gender, OrgBookingOrderInfolDto, OrgBookingOrderServiceProxy, RemarkBookingOrderInput, Status } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { Moment } from 'moment';
import { BookingOrderStatus } from 'shared/AppEnums';
import { SortDescriptor } from '@progress/kendo-data-query';
import { BookingOrderStatusService } from 'shared/services/booking-order-status.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'xiaoyuyue-customer-info-model',
    templateUrl: './booking-order-info-model.component.html',
    styleUrls: ['./booking-order-info-model.component.scss']
})
export class BookingOrderInfoModelComponent extends AppComponentBase implements OnInit {
    dataItem: OrgBookingOrderInfolDto = new OrgBookingOrderInfolDto();
    dataItemId: number;
    remarkInput: RemarkBookingOrderInput = new RemarkBookingOrderInput();
    defaultAvatarUrl = 'assets/common/images/default-profile-picture.png';
    bookingOrderStatusName: string[];
    confirming = false;
    updating = false;

    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('bookingOrderInfoModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _orderStatusService: BookingOrderStatusService,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingOrderStatusName = this._orderStatusService.DisplayStatus;
    }

    showModel(dataItemId: number): void {
        if (!dataItemId) {
            return;
        }
        this.modal.show();
        this.dataItemId = dataItemId;
        this._orgBookingOrderServiceProxy
            .getOrderDetail(dataItemId)
            .subscribe(result => {
                this.dataItem = result;
            })

    }

    hideModel(): void {
        this.modal.hide();
    }

    // 备注订单
    remarkBookingOrder(): void {
        this.updating = true;
        this.remarkInput = new RemarkBookingOrderInput();
        this.remarkInput.id = this.dataItem.id;
        this.remarkInput.remark = this.dataItem.remark;
        this._orgBookingOrderServiceProxy
            .remarkBookingOrder(this.remarkInput)
            .finally(() => {
                this.updating = false;
            })
            .subscribe(() => {
                this.hideModel();
                this.isShowModelHander.emit(true);
                this.notify.success(this.l('UpdateSuccess'));
            });
    }

    // 确认订单
    confirmCustomerOrder(): void {
        this.confirming = true;
        const input = new EntityDtoOfInt64();
        input.id = this.dataItem.id;
        this._orgBookingOrderServiceProxy
            .confirmBookingOrder(input)
            .finally(() => {
                this.confirming = false;
            })
            .subscribe(() => {
                this.hideModel();
                this.isShowModelHander.emit(true);
                this.notify.success(this.l('Booking.Confirm.Success'));
            });
    }

    // 获取用户头像
    getProfileAvatar(): string {
        if (this.dataItem.profilePictureUrl) {
            return this.dataItem.profilePictureUrl;
        }
        return this.defaultAvatarUrl;
    }
}
