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
import { SelectHelper } from 'shared/helpers/SelectHelper';
import { BookingOrderListDtoStatus } from '@shared/service-proxies/service-proxies';

export class SingleBookingStatus {
    value: any;
    displayText: any;
}

@Component({
    selector: 'xiaoyuyue-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
    animations: [appModuleAnimation()]
})

export class CustomerListComponent extends AppComponentBase implements OnInit {
    singleBookingStatus: SingleBookingStatus = new SingleBookingStatus();
    searchActiveSelectDefaultItem: { value: string, displayText: string; };
    orderStatusSelectList: Object[] = [];
    genderSelectListData: Object[] = SelectHelper.genderList();
    skipCount: number = 0;
    maxResultCount: number = AppConsts.grid.defaultPageSize;
    sorting: Array<SortDescriptor> = [];
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
    bookingOrderStatus: Status[] = [OrgBookingOrderStatus.State1, OrgBookingOrderStatus.State2, OrgBookingOrderStatus.State3, OrgBookingOrderStatus.State4, OrgBookingOrderStatus.State5];
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
        this.searchActiveSelectDefaultItem = {
            value: "",
            displayText: "请选择"
        };
        this.getOrderStatusSelectList();
    }

    ngAfterViewInit() {
        $("#bookingOrderDate").flatpickr({
            "locale": "zh"
        });

        $("#startCreationTime").flatpickr({
            "locale": "zh"
        });

        $("#endCreationTime").flatpickr({
            "locale": "zh"
        });
    }

    loadData(): void {
        this.bookingDate = this.bookingDate ? moment(this.bookingDate) : undefined;
        // TODO 订单创建时间搜索未做
        // this.startCreationTime = this.startCreationTime ? moment(this.startCreationTime) : undefined;
        // this.endCreationTime = this.endCreationTime ? moment(this.endCreationTime) : undefined;
        
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

    // 获取预约状态下拉框数据源
    getOrderStatusSelectList(): void {
        this.bookingOrderStatus.forEach((value, index) => {
            this.singleBookingStatus = new SingleBookingStatus();
            this.singleBookingStatus.value = value;
            this.singleBookingStatus.displayText = this.bookingOrderStatusName[index];
            this.orderStatusSelectList.push(this.singleBookingStatus);
        });
    }

    public editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex);
    }

    public cancelHandler({ sender, rowIndex }) {
        this.loadData();
        sender.closeRow(rowIndex);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
    }

    public saveHandler({ sender, rowIndex, dataItem, isNew }) {
        sender.closeRow(rowIndex);
        console.log((dataItem));
        this.remarkBookingOrderInput.id = dataItem.id;
        this.remarkBookingOrderInput.remark = dataItem.remark;
        this.remarkBookingOrder(this.remarkBookingOrderInput);
    }

    public onStateonStateChange(event): void {}

    public genderChangeHandler(gender: Gender): void {
        this.gender = gender;
    }

    public orderStatusChangeHandler(status: Status): void {
        if (!!status == false) {
            this.bookingOrderStatus = [Status._1, Status._2, Status._3, Status._4, Status._5];
            return;
        }
        this.bookingOrderStatus = [status];
    }
}

