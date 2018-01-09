import * as _ from 'lodash';

import { BatchConfirmInput, EntityDtoOfInt64, Gender, OrgBookingOrderInfolDto, OrgBookingOrderServiceProxy, RemarkBookingOrderInput, Status } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { Moment } from 'moment';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'xiaoyuyue-customer-info-model',
    templateUrl: './booking-order-info-model.component.html',
    styleUrls: ['./booking-order-info-model.component.scss']
})
export class BookingOrderInfoModelComponent extends AppComponentBase implements OnInit {
    dataItem: OrgBookingOrderInfolDto = new OrgBookingOrderInfolDto();
    dataItemId: number;
    isShowModelFlag = false;
    remarkInput: RemarkBookingOrderInput = new RemarkBookingOrderInput();
    defaultAvatarUrl = 'assets/common/images/default-profile-picture.png';
    bookingOrderStatusName: string[] = [this.l(OrgBookingOrderStatus.WaitConfirmLocalization),
    this.l(OrgBookingOrderStatus.ConfirmSuccessLocalization),
    this.l(OrgBookingOrderStatus.WaitCommentLocalization),
    this.l(OrgBookingOrderStatus.CancelLocalization),
    this.l(OrgBookingOrderStatus.CompleteLocalization)];


    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    showModel(dataItemId: number): void {
        if (!dataItemId) {
            return;
        }
        this.dataItemId = dataItemId;
        this._orgBookingOrderServiceProxy
            .getOrderDetail(dataItemId)
            .subscribe(result => {
                this.dataItem = result;
                this.isShowModelFlag = true;
            })

    }

    hideModel(): void {
        this.isShowModelFlag = false;
    }

    // 备注订单
    remarkBookingOrder(): void {
        this.remarkInput = new RemarkBookingOrderInput();
        this.remarkInput.id = this.dataItem.id;
        this.remarkInput.remark = this.dataItem.remark;
        this._orgBookingOrderServiceProxy
            .remarkBookingOrder(this.remarkInput)
            .subscribe(() => {
                this.hideModel();
                this.isShowModelHander.emit(true);
                this.notify.success(this.l('UpdateSuccess'));
            });
    }

    // 确认订单
    confirmCustomerOrder(): void {
        const input = new EntityDtoOfInt64();
        input.id = this.dataItem.id;
        this._orgBookingOrderServiceProxy
            .confirmBookingOrder(input)
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

    // 订单状态样式
    setOrderTipsClass(status: number): any {
        const tipsClass = {
            status1: status === 1,
            status2: status === 2,
            status3: status === 3,
            status4: status === 4,
            status5: status === 5
        };
        return tipsClass;
    }
}
