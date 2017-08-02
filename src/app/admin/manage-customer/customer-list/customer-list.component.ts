import { Component, OnInit, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { OrgBookingOrderServiceProxy, Gender, Status, RemarkBookingOrderInput } from "shared/service-proxies/service-proxies";
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';
import { OrgBookingOrderStatus } from "shared/AppEnums";
import { EditEvent } from '@progress/kendo-angular-grid';


@Component({
    selector: 'xiaoyuyue-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
    animations: [appModuleAnimation()]
})
export class CustomerListComponent extends AppComponentBase implements OnInit {
    skipCount: number = 0;
    maxResultCount: number = AppConsts.grid.defaultPageSize;
    sorting: Array<SortDescriptor> = [];
    bookingOrderStatus: Status[] = [OrgBookingOrderStatus.State1, OrgBookingOrderStatus.State2, OrgBookingOrderStatus.State3, OrgBookingOrderStatus.State4, OrgBookingOrderStatus.State5];
    creationDate: moment.Moment;
    gender: Gender;
    phoneNumber: string;
    endMinute: number;
    startMinute: number;
    bookingDate: moment.Moment;
    customerName: string;
    bookingName: string;
    customerListData: AppGridData;
    remarkBookingOrderInput: RemarkBookingOrderInput = new RemarkBookingOrderInput();
    bookingOrderStatusName: string[] = ["待确认", "已确认", "待评价", "已取消", "已完成"];

    private editedRowIndex: number;


    public get isInEditingMode(): boolean {
        return this.editedRowIndex !== undefined;
    }

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _customerListGridDataResult: AppGridData,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.customerListData = this._customerListGridDataResult;
        this.loadData();
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

        let loadOrgBookingOrderData = () => {
            return this._orgBookingOrderServiceProxy
                .getOrders
                (this.bookingName,
                this.customerName,
                this.bookingDate,
                this.startMinute,
                this.endMinute,
                this.phoneNumber,
                this.gender,
                this.creationDate,
                this.bookingOrderStatus,
                sorting,
                maxResultCount,
                skipCount);
        };

        this._customerListGridDataResult.query(loadOrgBookingOrderData);
    }

    // 备注订单
    remarkBookingOrder(remarkInput: RemarkBookingOrderInput): void {
        this._orgBookingOrderServiceProxy
            .remarkBookingOrder(remarkInput)
            .subscribe(() => {
                this.loadData();
            });
    }

    // 订单状态样式
    setOrderTipsClass(status: number): any {
        let tipsClass = {
            status1: status == 1,
            status2: status == 2,
            status3: status == 3,
            status4: status == 4,
            status5: status == 5
        }
        return tipsClass;
    }

    protected editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex);
    }

    protected cancelHandler({ sender, rowIndex }) {
        this.loadData();
        sender.closeRow(rowIndex);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
    }

    protected saveHandler({ sender, rowIndex, dataItem, isNew }) {
        sender.closeRow(rowIndex);
        console.log((dataItem));
        this.remarkBookingOrderInput.id = dataItem.id;
        this.remarkBookingOrderInput.remark = dataItem.remark;
        this.remarkBookingOrder(this.remarkBookingOrderInput);
    }
}
