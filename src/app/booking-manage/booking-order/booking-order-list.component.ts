import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BookingOrderListDtoStatus, PagedResultDtoOfOrgBookingOrderListDto } from '@shared/service-proxies/service-proxies';
import { DataStateChangeEvent, EditEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Gender, OrgBookingOrderListDto, OrgBookingOrderServiceProxy, OrgBookingServiceProxy, RemarkBookingOrderInput, SelectListItemDto, Status } from 'shared/service-proxies/service-proxies';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { BookingOrderInfoModelComponent } from './info-model/booking-order-info-model.component';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { Moment } from 'moment';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { SelectHelperService } from 'shared/services/select-helper.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import timeago from 'timeago.js';

export class SingleBookingStatus {
    value: any;
    displayText: any;
}

@Component({
    selector: 'xiaoyuyue-customer-list',
    templateUrl: './booking-order-list.component.html',
    styleUrls: ['./booking-order-list.component.scss'],
    animations: [accountModuleAnimation()]
})

export class BookingOrderListComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    totalItems: number;
    availableTimesSelectListData: SelectListItemDto[];
    availableDatesSelectListData: SelectListItemDto[];
    hourOfDay: string;

    mobileCustomerListData: OrgBookingOrderListDto[] = [];
    allMobileCustomerListData: any[] = [];
    updateDataIndex = -1;
    infiniteScrollDistance = 1;
    infiniteScrollThrottle = 300;

    bookingCustomerDate: string;
    bookingDateSelectDefaultItem: SelectListItemDto;
    bookingItemSelectListData: SelectListItemDto[];
    bookingCustomerFlatpickr: any;
    cEndCreationTime: any;
    cStartCreationTime: any;
    cBookingOrderDate: any;
    bookingId = 0;
    creationEndDate: any;
    creationStartDate: any;
    singleBookingStatus: SingleBookingStatus = new SingleBookingStatus();
    searchActiveSelectDefaultItem: { value: string, displayText: string; };
    orderStatusSelectList: Object[] = [];
    genderSelectListData: Object[] = this._selectHelper.genderList();

    gridParam: BaseGridDataInputDto
    gender: Gender;
    phoneNumber: string;
    endMinute: number;
    startMinute: number;
    bookingDate: Moment;
    customerName: string;
    bookingName: string;
    customerListData = new AppGridData();
    remarkBookingOrderInput: RemarkBookingOrderInput = new RemarkBookingOrderInput();
    bookingOrderStatus: Status[] = [OrgBookingOrderStatus.WaitConfirm,
    OrgBookingOrderStatus.ConfirmSuccess,
    OrgBookingOrderStatus.ConfirmFail,
    OrgBookingOrderStatus.Cancel,
    // OrgBookingOrderStatus.WaitComment,
    OrgBookingOrderStatus.Complete];

    displayStatus: string[] = [this.l(OrgBookingOrderStatus.WaitConfirmLocalization),
    this.l(OrgBookingOrderStatus.ConfirmSuccessLocalization),
    this.l(OrgBookingOrderStatus.WaitCommentLocalization),
    this.l(OrgBookingOrderStatus.CancelLocalization),
    this.l(OrgBookingOrderStatus.CompleteLocalization)];

    searching = false;

    @ViewChild('customerForEditModelComponent') CustomerForEditModelComponent: BookingOrderInfoModelComponent;

    private editedRowIndex: number;

    public get isInEditingMode(): boolean {
        return this.editedRowIndex !== undefined;
    }

    constructor(

        injector: Injector,
        private _route: ActivatedRoute,
        private _selectHelper: SelectHelperService,
        private _orgBookingServiceProxy: OrgBookingServiceProxy,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _sessionService: AppSessionService

    ) {
        super(injector);
        this.gridParam = new BaseGridDataInputDto(this._sessionService);
        this.gridParam.SkipCount = this.gridParam.MaxResultCount * (this.gridParam.CurrentPage - 1);
        if (this.gridParam.SkipCount < 0) {
            this.gridParam.SkipCount = 0;
        }
    }

    ngOnInit() {
        this.bookingCustomerDate = moment().local().format('YYYY-MM-DD');
        this.bookingDateSelectDefaultItem = this._selectHelper.defaultSelectList();
        this.searchActiveSelectDefaultItem = this._selectHelper.defaultList();
        this.getOrderStatusSelectList();
    }

    ngAfterViewInit() {
        const self = this;
        if (this.isMobile($('.mobile-custom-list'))) {
            this.getMobileBookingData();
        } else {
            this.loadData();
            this.cBookingOrderDate = $('#bookingDate').flatpickr({
                'locale': LocalizationHelper.getFlatpickrLocale(),
                onOpen: (dateObj, dateStr) => {
                    this.bookingDate = null;
                }
            });
            this.cStartCreationTime = $('#startCreationTime').flatpickr({
                'locale': LocalizationHelper.getFlatpickrLocale(),
                onOpen: (dateObj, dateStr) => {
                    this.creationStartDate = null;
                }
            });
            this.cEndCreationTime = $('#endCreationTime').flatpickr({
                'locale': LocalizationHelper.getFlatpickrLocale(),
                onOpen: (dateObj, dateStr) => {
                    this.creationEndDate = null;
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.isMobile($('.mobile-custom-list'))) {
            return;
        } else {
            this.destroyDesktopFlatpickr();
        }
    }

    destroyDesktopFlatpickr(): void {
        if (this.cBookingOrderDate && this.cStartCreationTime && this.cEndCreationTime) {
            this.cBookingOrderDate.destroy();
            this.cStartCreationTime.destroy();
            this.cEndCreationTime.destroy();
        }
    }

    searchData() {
        this.searching = true;
        this.loadData();
    }

    loadData(): void {
        this.bookingDate = this.bookingDate ? moment(this.bookingDate) : undefined;
        this.creationStartDate = this.creationStartDate ? moment(this.creationStartDate) : undefined;
        this.creationEndDate = this.creationEndDate ? moment(this.creationEndDate) : undefined;
        const loadOrgBookingOrderData = () => {
            return this._orgBookingOrderServiceProxy
                .getOrders(this.bookingId,
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
                this.bookingOrderStatus,
                this.gridParam.GetSortingString(),
                this.gridParam.MaxResultCount,
                this.gridParam.SkipCount);
        };

        this.customerListData.query(loadOrgBookingOrderData, false, () => {
            this.searching = false;
        });
        if (typeof this.creationStartDate === 'object') {
            this.creationStartDate = this.creationStartDate.format('YYYY-MM-DD');
        }
        if (typeof this.creationEndDate === 'object') {
            this.creationEndDate = this.creationEndDate.format('YYYY-MM-DD');
        }
    }

    showCustomerForEditHander(dataItemId: any): void {
        this.CustomerForEditModelComponent.showModel(dataItemId);
    }

    // 应约人列表model弹窗，若关闭应该刷新数据
    isShowConfirmOrderModelHander(flag: boolean): void {
        if (flag) {
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
        const tipsClass = {
            status1: status === 1,
            status2: status === 2,
            status3: status === 3,
            status4: status === 4,
            status5: status === 5
        };
        return tipsClass;
    }

    // 获取预约状态下拉框数据源
    getOrderStatusSelectList(): void {
        this.bookingOrderStatus.forEach((value, index) => {
            this.singleBookingStatus = new SingleBookingStatus();
            this.singleBookingStatus.value = value;
            this.singleBookingStatus.displayText = this.displayStatus[index];
            this.orderStatusSelectList.push(this.singleBookingStatus);
        });
    }

    // 获取应约人头像
    getBookingCustomerAvatar(url: string): string {
        const defaultAvatar = 'assets/common/images/default-profile-picture.png';
        if (url !== '') {
            return url;
        }
        return defaultAvatar;
    }

    public onStateonStateChange(event): void { }

    public genderChangeHandler(gender: Gender): void {
        this.gender = gender;
    }

    public editRowHandler(index): void {
        const dataItem = this.customerListData.value.data[index];
        this.showCustomerForEditHander(dataItem.id);
    }

    public orderStatusChangeHandler(status: Status): void {
        if (!!status === false) {
            this.bookingOrderStatus = [Status._1, Status._2, Status._3, Status._4, Status._5];
            return;
        }
        this.bookingOrderStatus = [status];
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;
        this.loadData();
    }

    // 获取日期搜索
    dateSelectHandler(date: string): void {
        if (date === '') {
            this.bookingDate = undefined;
            this.mobileLoadData();
            return;
        }
        this.bookingDate = moment(date).local();
        this.mobileLoadData();
    }

    // PC端是返回的kendo的数据格式，移动端重写获取数据方法
    getMobileBookingData(): void {
        this._route.queryParams
            .subscribe(params => {
                this.bookingId = params['bookingId'];
                this.getBookingDateSeletcList();
                this.mobileLoadData();
            })
    }

    mobileLoadData(): void {
        this._orgBookingOrderServiceProxy
            .getOrders(this.bookingId,
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
            this.bookingOrderStatus,
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount)
            .subscribe(result => {
                this.mobileCustomerListData = result.items;
                this.totalItems = result.totalCount;
                if (this.mobileCustomerListData.length > 0 && this.updateDataIndex < 0) {
                    this.allMobileCustomerListData.push(this.mobileCustomerListData);
                } else {
                    this.allMobileCustomerListData[this.updateDataIndex] = this.mobileCustomerListData;
                }
            })
    }

    getProfilePictureUrl(profilePictureUrl: string): string {
        const defaultAvatar = 'assets/common/images/default-profile-picture.png';
        if (profilePictureUrl === '') {
            return defaultAvatar;
        }
        return profilePictureUrl;
    }

    getTimeAgo(time: any): string {
        const timeagoInstance = timeago(moment().local().format('YYYY-MM-DD hh:mm:ss'));
        return timeagoInstance.format(time.local().format('YYYY-MM-DD hh:mm:ss'), 'zh_CN');
    }

    private isHourOfDate(str: string): boolean {
        let temp = str.split('-')
        return;
    }

    // 获取可用日期和时间下拉框数据源
    getBookingDateSeletcList(): void {
        this._orgBookingServiceProxy
            .getAvailableBookingDateAndTime(this.bookingId)
            .subscribe(result => {
                this.availableDatesSelectListData = result.availableDates;
                this.availableTimesSelectListData = result.availableTimes;
            })
    }

    public bookingDateChangeHandler(value: any): void {
        if (value === '0' || value === '') {
            this.bookingDate = undefined;
            this.mobileLoadData();
            return;
        }
        this.bookingDate = moment(value).local();
        this.mobileLoadData();
    }

    public bookingTimeChangeHandler(value: any): void {
        if (value === '0' || value === '') {
            this.hourOfDay = undefined;
            this.mobileLoadData();
            return;
        }
        this.hourOfDay = value;
        this.mobileLoadData();
    }

    public pageChange(event: PageChangeEvent): void {
        this.gridParam.CurrentPage = (this.gridParam.SkipCount + this.gridParam.MaxResultCount) / this.gridParam.MaxResultCount;
        this.gridParam.setPage();
        this.gridParam.SkipCount = this.gridParam.MaxResultCount * (this.gridParam.CurrentPage - 1);
    }

    public onScrollDown(): void {
        this.updateDataIndex = -1;
        let totalCount = 0;
        this.allMobileCustomerListData.forEach(organizationBookingResultData => {
            organizationBookingResultData.forEach(element => {
                totalCount++;
            });
        });
        this.gridParam.SkipCount = totalCount;
        if (this.gridParam.SkipCount >= this.totalItems) {
            return;
        }
        this.mobileLoadData();
    }
}

