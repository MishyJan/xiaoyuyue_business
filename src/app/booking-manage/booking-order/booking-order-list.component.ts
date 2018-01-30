import { AfterViewInit, Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Gender, OrgBookingOrderListDto, OrgBookingOrderServiceProxy, OrgBookingServiceProxy, RemarkBookingOrderInput, SelectListItemDto, Status } from 'shared/service-proxies/service-proxies';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { BookingOrderInfoModelComponent } from './info-model/booking-order-info-model.component';
import { BookingOrderStatusService } from 'shared/services/booking-order-status.service';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { Moment } from 'moment';
import { SelectHelperService } from 'shared/services/select-helper.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import timeago from 'timeago.js';
import { ScrollStatusOutput } from 'app/shared/utils/list-scroll.dto';
import { ListScrollService } from 'shared/services/list-scroll.service';
import { SpreadMoreService } from 'shared/services/spread-more.service';

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
    scrollStatusOutput: ScrollStatusOutput;
    totalItems: number;
    availableTimesSelectListData: SelectListItemDto[];
    availableDatesSelectListData: SelectListItemDto[];
    hourOfDay: string;

    mobileCustomerListData: OrgBookingOrderListDto[] = [];
    allMobileCustomerListData: any[] = [];
    updateDataIndex = -1;

    bookingCustomerDate: string;
    bookingTimeSelectDefaultItem: SelectListItemDto;
    bookingDateSelectDefaultItem: SelectListItemDto;
    cEndCreationTime: any;
    cStartCreationTime: any;
    cBookingOrderDate: any;
    bookingId = 0;
    creationEndDate: any;
    creationStartDate: any;
    singleBookingStatus: SingleBookingStatus = new SingleBookingStatus();
    selectDefaultItem: { value: string, displayText: string; };
    orderStatusSelectList: Object[] = [];
    gender: Gender;
    genderSelectListData = this._selectHelper.genderList();
    checkIn: boolean;
    checkInSelectListData = this._selectHelper.checkInList();
    orderStatus: Status[];
    displayStatus: string[];
    spreadMoreService: SpreadMoreService;
    gridParam: BaseGridDataInputDto
    phoneNumber: string;
    endMinute: number;
    startMinute: number;
    bookingDate: any;
    customerName: string;
    bookingName: string;
    customerListData = new AppGridData();
    remarkBookingOrderInput: RemarkBookingOrderInput = new RemarkBookingOrderInput();

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
        private _listScrollService: ListScrollService,
        private _sessionService: AppSessionService,
        private _orderStatusService: BookingOrderStatusService
    ) {
        super(injector);
        this.spreadMoreService = new SpreadMoreService(AppConsts.bookingOrderSpreadMoreCache, this._sessionService.tenantId);
        this.gridParam = new BaseGridDataInputDto(this._sessionService);
        this.gridParam.SkipCount = this.gridParam.MaxResultCount * (this.gridParam.CurrentPage - 1);
    }

    ngOnInit() {
        this.bookingCustomerDate = moment().local().format('YYYY-MM-DD');
        this.getSelectListData();
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

    /*
        公用相关代码
    */
    // 显示用户订单弹窗model
    showCustomerForEditHandle(dataItemId: any): void {
        this.CustomerForEditModelComponent.showModel(dataItemId);
    }

    // 如果头像URL不存在，则使用默认头像
    public transferAvatarPictureUrl(profilePictureUrl: string): string {
        const defaultAvatar = 'assets/common/images/default-profile-picture.png';
        if (profilePictureUrl === '') {
            return defaultAvatar;
        }
        return profilePictureUrl;
    }

    /*
        桌面端相关代码
    */

    searchData() {
        this.searching = true;
        this.loadData();
    }

    loadData(): void {
        this.bookingDate = this.bookingDate ? this.transferUTCZone(this.bookingDate) : undefined;
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
                this.checkIn,
                this.creationStartDate,
                this.creationEndDate,
                this.orderStatus,
                this.gridParam.GetSortingString(),
                this.gridParam.MaxResultCount,
                this.gridParam.SkipCount);
        };

        this.customerListData.query(loadOrgBookingOrderData, false, () => {
            this.searching = false;
        });
        if (typeof this.bookingDate === 'object') {
            this.bookingDate = this.d(this.bookingDate);
        }
        if (typeof this.creationStartDate === 'object') {
            this.creationStartDate = this.creationStartDate.format('YYYY-MM-DD');
        }
        if (typeof this.creationEndDate === 'object') {
            this.creationEndDate = this.creationEndDate.format('YYYY-MM-DD');
        }
    }

    destroyDesktopFlatpickr(): void {
        if (this.cBookingOrderDate && this.cStartCreationTime && this.cEndCreationTime) {
            this.cBookingOrderDate.destroy();
            this.cStartCreationTime.destroy();
            this.cEndCreationTime.destroy();
        }
    }

    // 应约人列表model弹窗，若关闭应该刷新数据
    public hiddenOrderModelHandle(flag: boolean): void {
        if (flag) {
            this.loadData();
        }
    }

    // 切换页码
    public pageChange(event: PageChangeEvent): void {
        this.gridParam.CurrentPage = (this.gridParam.SkipCount + this.gridParam.MaxResultCount) / this.gridParam.MaxResultCount;
        this.gridParam.setPage();
        this.gridParam.SkipCount = this.gridParam.MaxResultCount * (this.gridParam.CurrentPage - 1);
    }

    // 获取预约状态下拉框数据源
    getSelectListData(): void {
        this.bookingDateSelectDefaultItem = this._selectHelper.defaultSelectList();
        this.selectDefaultItem = this._selectHelper.defaultList();
        this.orderStatus = this._orderStatusService.BookingOrderStatus;
        this.displayStatus = this._orderStatusService.DisplayStatus;
        this.orderStatusSelectList = this._orderStatusService.getOrderStatusSelectList();
        this.bookingTimeSelectDefaultItem = this._selectHelper.defaultTimeSelectList();
    }

    public genderChangeHandle(gender: Gender): void {
        this.gender = gender;
    }

    public editRowHandle(index): void {
        const dataItem = this.customerListData.value.data[index];
        this.showCustomerForEditHandle(dataItem.id);
    }

    public orderStatusChangeHandle(status: Status): void {
        if (!!status === false) {
            this.orderStatus = [Status._1, Status._2, Status._3, Status._4, Status._5];
            return;
        }
        this.orderStatus = [status];
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;
        this.loadData();
    }

    /*
        移动端相关代码
    */
    // PC端是返回的kendo的数据格式，移动端重写获取数据方法
    getMobileBookingData(): void {
        this._route.queryParams
            .subscribe(params => {
                this.bookingId = params['bookingId'];
                this.getBookingDateSeletcList();
                this.mobileLoadData();
            })
    }

    // scrollHandleBack: 接收一个回调函数，控制下拉刷新，上拉加载的状态
    mobileLoadData(scrollHandleBack?: any): void {
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
            this.checkIn,
            this.creationStartDate,
            this.creationEndDate,
            this.orderStatus,
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount)
            .finally(() => {
                scrollHandleBack && scrollHandleBack();
            })
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

    // 获取可用日期和时间下拉框数据源
    getBookingDateSeletcList(): void {
        this._orgBookingServiceProxy
            .getAvailableBookingDateAndTime(this.bookingId)
            .subscribe(result => {
                this.availableDatesSelectListData = result.availableDates;
                this.availableTimesSelectListData = result.availableTimes;
            })
    }

    // 应约人列表model弹窗，若关闭应该刷新数据
    public hiddenMobileOrderModelHandle(flag: boolean): void {
        if (flag) {
            this.mobileLoadData();
        }
    }

    public getTimeAgo(time: any): string {
        const timeagoInstance = timeago(moment().local().format('YYYY-MM-DD hh:mm:ss'));
        return timeagoInstance.format(time.local().format('YYYY-MM-DD hh:mm:ss'), 'zh_CN');
    }

    // 下拉刷新
    public pullDownRefresh(): void {
        this.updateDataIndex = 0;
        this.gridParam.SkipCount = 0;
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledDownActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.mobileLoadData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.pulledDownActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }

    // 上拉加载
    public pullUpLoad(): void {
        this.updateDataIndex = -1;
        let totalCount = 0;
        this.allMobileCustomerListData.forEach(personBookingTotalCount => {
            personBookingTotalCount.forEach(element => {
                totalCount++;
            });
        });
        this.gridParam.SkipCount = totalCount;
        if (this.gridParam.SkipCount >= this.totalItems) {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.noMore = true;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
            return;
        }
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledUpActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.mobileLoadData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.pulledUpActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }

    public bookingDateChangeHandler(value: any): void {
        this.updateDataIndex = 0;
        if (value === '0' || value === '') {
            this.bookingDate = undefined;
            this.mobileLoadData();
            return;
        }
        this.bookingDate = moment(value).local();
        this.mobileLoadData();
    }

    public bookingTimeChangeHandler(value: any): void {
        this.updateDataIndex = 0;
        if (value === '0' || value === '') {
            this.hourOfDay = undefined;
            this.mobileLoadData();
            return;
        }
        this.hourOfDay = value;
        this.mobileLoadData();
    }
}