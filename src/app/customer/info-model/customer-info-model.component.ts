import * as _ from 'lodash';
import * as moment from 'moment';

import { BatchComfirmInput, EntityDtoOfInt64, Gender, OrgBookingOrderInfolDto, OrgBookingOrderServiceProxy, RemarkBookingOrderInput, Status } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'xiaoyuyue-customer-info-model',
    templateUrl: './customer-info-model.component.html',
    styleUrls: ['./customer-info-model.component.scss']
})
export class CustomerForEditModelComponent extends AppComponentBase implements OnInit {
    dataItem: OrgBookingOrderInfolDto = new OrgBookingOrderInfolDto();
    dataItemId: number;
    isShowModelFlag = false;
    remarkInput: RemarkBookingOrderInput = new RemarkBookingOrderInput();
    defaultAvatarUrl = 'assets/common/images/default-profile-picture.png';
    bookingOrderStatusName: string[] = ['待确认', '已确认', '待评价', '已取消', '已完成'];


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
        this.isShowModelHander.emit(this.isShowModelFlag);
    }

    // 备注订单
    remarkBookingOrder(): void {
        this.remarkInput = new RemarkBookingOrderInput();
        this.remarkInput.id = this.dataItem.id;
        this.remarkInput.remark = this.dataItem.remark;
        this._orgBookingOrderServiceProxy
            .remarkBookingOrder(this.remarkInput)
            .subscribe(() => {
                this.notify.success('备注已修改');
            });
    }

    // 确认订单
    confirmCustomerOrder(): void {
        const input = new EntityDtoOfInt64();
        input.id = this.dataItem.id;
        this._orgBookingOrderServiceProxy
            .comfirmBookingOrder(input)
            .subscribe(() => {
                this.hideModel();
                this.isShowModelHander.emit(false);
                this.notify.success('订单已确认');
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
