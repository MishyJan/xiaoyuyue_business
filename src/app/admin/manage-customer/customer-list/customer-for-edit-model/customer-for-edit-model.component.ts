import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { OrgBookingOrderServiceProxy, Gender2, Status2, BatchComfirmInput, EntityDtoOfInt64, BookingOrderListDto, RemarkBookingOrderInput } from 'shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppConsts } from 'shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { GridDataResult, EditEvent } from '@progress/kendo-angular-grid';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';

@Component({
    selector: 'xiaoyuyue-customer-for-edit-model',
    templateUrl: './customer-for-edit-model.component.html',
    styleUrls: ['./customer-for-edit-model.component.scss']
})
export class CustomerForEditModelComponent extends AppComponentBase implements OnInit {
    isShowModelFlag: boolean = false;
    dataItem: BookingOrderListDto = new BookingOrderListDto();
    remarkInput: RemarkBookingOrderInput = new RemarkBookingOrderInput();
    defaultAvatarUrl: string = "assets/common/images/default-profile-picture.png";
    bookingOrderStatusName: string[] = ["待确认", "已确认", "待评价", "已取消", "已完成"];


    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    showModel(dataItem: BookingOrderListDto): void {
        if (!dataItem) {
            return;
        }
        this.dataItem = dataItem;
        this.isShowModelFlag = true;
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
                this.notify.success("备注已修改");
            });
    }

    // 确认订单
    confirmCustomerOrder(): void {
        let input = new EntityDtoOfInt64();
        input.id = this.dataItem.id;
        this._orgBookingOrderServiceProxy
            .comfirmBookingOrder(input)
            .subscribe(() => {
                this.hideModel();
                this.isShowModelHander.emit(false);
                this.notify.success("订单已确认");
            })
    }

    // 获取用户头像
    getProfileAvatar(): string {
        // if (this.dataItem.picUrl) {
        //     return this.dataItem.picUrl;
        // }

        return this.defaultAvatarUrl;
    }
}
