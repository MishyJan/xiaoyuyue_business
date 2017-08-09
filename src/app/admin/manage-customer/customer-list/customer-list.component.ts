import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { OrgBookingOrderServiceProxy, Gender, Status, RemarkBookingOrderInput } from "shared/service-proxies/service-proxies";
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';
import { OrgBookingOrderStatus } from "shared/AppEnums";
import { EditEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SelectHelper } from 'shared/helpers/SelectHelper';
import { BookingOrderListDtoStatus } from '@shared/service-proxies/service-proxies';
import { CustomerForEditModelComponent } from './customer-for-edit-model/customer-for-edit-model.component';

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
    creationEndDate: any;
    creationStartDate: any;
    singleBookingStatus: SingleBookingStatus = new SingleBookingStatus();
    searchActiveSelectDefaultItem: { value: string, displayText: string; };
    orderStatusSelectList: Object[] = [];
    genderSelectListData: Object[] = SelectHelper.genderList();
    skipCount: number = 0;
    maxResultCount: number = AppConsts.grid.defaultPageSize;
    sorting: Array<SortDescriptor> = [];
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

    @ViewChild('customerForEditModelComponent') CustomerForEditModelComponent: CustomerForEditModelComponent;


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
            this.creationStartDate = this.creationStartDate ? moment(this.creationStartDate) : undefined;
            this.creationEndDate = this.creationEndDate ? moment(this.creationEndDate) : undefined;
            return this._orgBookingOrderServiceProxy
                .getOrders
                (this.bookingName,
                this.customerName,
                this.bookingDate,
                this.startMinute,
                this.endMinute,
                this.phoneNumber,
                this.gender,
                this.creationStartDate,
                this.creationEndDate,
                this.bookingOrderStatus,
                sorting,
                maxResultCount,
                skipCount);
        };

        this._customerListGridDataResult.query(loadOrgBookingOrderData);
        if (typeof this.creationStartDate === "object") {
            this.creationStartDate = this.creationStartDate.format('YYYY-MM-DD');
            this.creationEndDate = this.creationEndDate.format('YYYY-MM-DD');
        }
    }

    showCustomerForEditHander(dataItem: any): void {
        this.CustomerForEditModelComponent.showModel(dataItem);
    }

    // 应约人列表model弹窗，若关闭应该刷新数据
    isShowComfirmOrderModelHander(flag: boolean): void {
        if (!flag) {
            this.loadData();
        }
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

    public onStateonStateChange(event): void { }

    public genderChangeHandler(gender: Gender): void {
        this.gender = gender;
    }

    public editRowHandler(index): void {
        let dataItem = this.customerListData.value.data[index];
        this.showCustomerForEditHander(dataItem);
    }

    public orderStatusChangeHandler(status: Status): void {
        if (!!status == false) {
            this.bookingOrderStatus = [Status._1, Status._2, Status._3, Status._4, Status._5];
            return;
        }
        this.bookingOrderStatus = [status];
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.skipCount = skip;
        this.maxResultCount = take;
        this.sorting = sort;

        this.loadData();
    }


}

