import * as _ from 'lodash';

import { ActiveOrDisableInput, BookingListDto, CreateOrUpdateBookingInput, OrgBookingServiceProxy, OutletServiceServiceProxy, PagedResultDtoOfBookingListDto, SelectListItemDto } from 'shared/service-proxies/service-proxies';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Injector, OnDestroy, OnInit, QueryList, ViewChild, ViewEncapsulation } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BookingCustomModelComponent } from './shared/booking-custom-model/booking-custom-model.component';
import { ClientTypeHelper } from 'shared/helpers/ClientTypeHelper';
import { ConfirmOrderModelComponent } from './shared/confirm-order-model/confirm-order-model.component';
import { LocalStorageService } from 'shared/utils/local-storage.service';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { MobileConfirmOrderModelComponent } from './shared/mobile-confirm-order-model/mobile-confirm-order-model.component';
import { MobileShareBookingModelComponent } from './shared/mobile-share-booking-model/share-booking-model.component';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ShareBookingModelComponent } from 'app/booking-manage/booking/create-or-edit/share-booking-model/share-booking-model.component';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/sort-descriptor';
import { Title } from '@angular/platform-browser';
import { appModuleSlowAnimation } from 'shared/animations/routerTransition';
import { SelectHelperService } from 'shared/services/select-helper.service';
import { ListScrollService } from 'shared/services/list-scroll.service';
import { ScrollStatusOutput } from 'app/shared/utils/list-scroll.dto';

@Component({
    selector: 'app-manage-booking',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.scss'],
    animations: [appModuleSlowAnimation()],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
})

export class BookingListComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    scrollStatusOutput: ScrollStatusOutput = new ScrollStatusOutput();
    flipIsToBackFlag: boolean[] = [];
    updateDataIndex = -1;
    allOrganizationBookingResultData: any[] = [];

    infiniteScrollDistance = 1;
    infiniteScrollThrottle = 300;

    actionFlag: boolean[] = [];
    bEndCreationTime: any;
    bStartCreationTime: any;
    countOverbrimTopValue: number;
    bookingOverbrimValue = 0;
    // 保存预约列表背景图的比例
    bookingBgW = 384;
    bookingBgH = 214;

    activeOrDisable: ActiveOrDisableInput = new ActiveOrDisableInput();
    outletSelectDefaultItem = '0';
    outletSelectListData: SelectListItemDto[] = [];
    bookingActiveSelectListData: Object[] = this._selectHelper.boolList();
    bookingActiveSelectDefaultItem: object;

    organizationBookingResultData: BookingListDto[] = [];
    pictureDefaultBgUrl = '/assets/common/images/login/bg1.jpg';
    // pictureDefaultBgUrl: string = "/assets/common/images/admin/booking-bg.jpg";

    endCreationTime: any;
    startCreationTime: any;
    isActive: boolean;
    outletId = 0;
    bookingName: string;

    maxResultCount = 8;
    skipCount = 0;
    sorting: string;
    totalItems = 0;
    currentPage = 0;
    slogan = this.l('Nothing.Need2Create');

    copying = false;
    deleting = false;
    searching = false;

    shareBaseUrl: string = AppConsts.userCenterUrl + '/booking/';
    @ViewChild('confirmOrderModelComponent') ConfirmOrderModelComponent: ConfirmOrderModelComponent;
    @ViewChild('bookingCustomModelComponent') BookingCustomModelComponent: BookingCustomModelComponent;
    @ViewChild('shareBookingModel') shareBookingModel: ShareBookingModelComponent;
    @ViewChild('bookingBg') bookingBgElement: ElementRef;
    @ViewChild('mobileShareBookingModel') mobileShareBookingModel: MobileShareBookingModelComponent;
    @ViewChild('mobileConfirmOrderModel') mobileConfirmOrderModel: MobileConfirmOrderModelComponent;

    constructor(
        injector: Injector,
        private _router: Router,
        private _listScrollService: ListScrollService,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _organizationBookingServiceProxy: OrgBookingServiceProxy,
        private _localStorageService: LocalStorageService,
        private _title: Title,
        private _selectHelper: SelectHelperService,
        private _sessionService: AppSessionService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingActiveSelectDefaultItem = this._selectHelper.defaultList();
        this.outletSelectListData.unshift(this._selectHelper.defaultSelectList());
        this.loadSelectListData();
    }

    ngAfterViewInit() {
        this.loadData();
        if (!this.isMobile($('.mobile-manage-booking'))) {
            this.initFlatpickr();
        }
    }

    ngOnDestroy() {
        if (!this.isMobile($('.mobile-manage-booking')) && this.bStartCreationTime && this.bEndCreationTime) {
            this.bStartCreationTime.destroy();
            this.bEndCreationTime.destroy();
        }
    }

    /**
     * desktop
     */
    initFlatpickr() {
        this.bStartCreationTime = $('.startCreationTime').flatpickr({
            'locale': LocalizationHelper.getFlatpickrLocale(),
            // clickOpens: false,
            onClose: (element) => {
                $(this.bStartCreationTime.input).blur();
            },
            onOpen: (dateObj, dateStr) => {
                this.startCreationTime = null;
            }
        })

        this.bEndCreationTime = $('.endCreationTime').flatpickr({
            'locale': LocalizationHelper.getFlatpickrLocale(),
            // clickOpens: false,
            onClose: (element) => {
                $(this.bEndCreationTime.input).blur();
            },
            onOpen: (dateObj, dateStr) => {
                this.endCreationTime = null;
            }
        })
    }

    // 正面翻转到背面
    flipIsToBack(index, filpType: boolean) {
        this.flipIsToBackFlag[index] = filpType;
    }

    // 禁用预约样式
    disabledBookingClass(indexI, indexJ) {
        if (this.isMobile($('.mobile-manage-booking'))) {
            this.activeOrDisable.id = this.allOrganizationBookingResultData[indexI][indexJ].id;
            this.updateDataIndex = indexI;
            this.skipCount = this.maxResultCount * this.updateDataIndex;
        } else {
            this.activeOrDisable.id = this.organizationBookingResultData[indexI].id;
        }
        this.activeOrDisable.isActive = false;
        this._organizationBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.notify.success(this.l('Booking.Disabled.Success'));
                this.loadData();
            });
    }

    // 显示禁用之前预约样式
    beforeBookingClass(indexI, indexJ) {
        if (this.isMobile($('.mobile-manage-booking'))) {
            this.activeOrDisable.id = this.allOrganizationBookingResultData[indexI][indexJ].id;
            this.updateDataIndex = indexI;
            this.skipCount = this.maxResultCount * this.updateDataIndex;
        } else {
            this.activeOrDisable.id = this.organizationBookingResultData[indexI].id;
        }
        this.activeOrDisable.isActive = true;
        this._organizationBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.notify.success(this.l('Booking.UnDisabled.Success'));
                this.loadData();
            });
    }

    // 显示待确认model
    showConfirmOrderHandler(bookingId: number): void {
        this.ConfirmOrderModelComponent.showModel(bookingId);
    }

    // 待确认model弹窗，若关闭应该刷新数据
    isShowComfirmOrderModelHandler(flag: boolean): void {
        if (flag) {
            this.loadData();
        }
    }

    // 显示应约人列表
    showBookingCostomHandler(bookingItem: BookingListDto): void {
        this.BookingCustomModelComponent.showModel(bookingItem);
    }

    // 获取预约完成百分比
    public getOverbrimValue(val1, val2): number {
        if (val1 <= 0 || val2 <= 0) { return 0; };
        this.bookingOverbrimValue = Math.round(val2 / val1 * 100);
        return this.bookingOverbrimValue;
    }

    private countOverbrimTop(val1, val2): number {
        if (val1 <= 0 || val2 <= 0) { return 32; };
        const maxResult = 74;
        const ratio = maxResult / 100;
        this.countOverbrimTopValue = -Math.round(((val2 / val1 * 100)) * ratio - 32);
        return this.countOverbrimTopValue;
    }

    private countOverbrimState(val1, val2): any {
        let temp = Math.round(val2 / val1 * 100);
        (val1 === 0 || val2 === 0) && (temp = 0);
        const state = {
            state1: 0 <= temp && temp <= 30,
            state2: 30 < temp && temp <= 60,
            state3: 60 < temp && temp <= 90,
            state4: 90 < temp && temp <= 100,
        };
        return state;
    }

    // 获取预约背景
    getBookingBgUrl(pictureUrl): string {
        if (pictureUrl !== '') {
            return pictureUrl;
        }
        return this.pictureDefaultBgUrl;
    }

    // 门店搜索下拉框值改变时
    outletChangeHandler(outlet: any): void {
        this.outletId = outlet;
    }
    // 预约状态搜索下拉框值改变时
    bookingActiveChangeHandler(bookingActive: any): void {
        this.isActive = bookingActive;
    }

    // 分享按钮弹出分享model
    shareHandler(bookingId: number): void {
        this.shareBookingModel.show(bookingId);
    }

    searchData() {
        this.searching = true;
        this.loadData();
    }

    // scrollHandleBack: 接收一个回调函数，控制下拉刷新，上拉加载的状态
    loadData(scrollHandleBack?: any): void {
        this.startCreationTime = this.startCreationTime ? moment(this.startCreationTime) : undefined;
        this.endCreationTime = this.endCreationTime ? moment(this.endCreationTime) : undefined;
        if (this.skipCount < 0) { this.skipCount = 0 };
        this._organizationBookingServiceProxy
            .getBookings(this.bookingName, this.outletId, this.isActive, this.startCreationTime, this.endCreationTime, this.sorting, this.maxResultCount, this.skipCount)
            .finally(() => {
                this.searching = false;
                scrollHandleBack && scrollHandleBack();
            })
            .subscribe(result => {
                const self = this;
                this.totalItems = result.totalCount;
                this.organizationBookingResultData = result.items;
                if (this.organizationBookingResultData.length > 0 && this.updateDataIndex < 0) {
                    this.allOrganizationBookingResultData.push(this.organizationBookingResultData);
                } else {
                    this.allOrganizationBookingResultData[this.updateDataIndex] = this.organizationBookingResultData;
                }
                if (typeof this.startCreationTime === 'object') {
                    this.startCreationTime = this.startCreationTime.format('YYYY-MM-DD');
                    this.endCreationTime = this.endCreationTime.format('YYYY-MM-DD');
                }

            }, error => {
                this.searching = false;
            });
    }

    pullDownRefresh(): void {
        this.updateDataIndex = 0;
        this.skipCount = 0;
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledDownActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.loadData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.pulledDownActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }

    pullUpLoad(): void {
        this.updateDataIndex = -1;
        let totalCount = 0;
        this.allOrganizationBookingResultData.forEach(organizationBookingResultData => {
            organizationBookingResultData.forEach(element => {
                totalCount++;
            });
        });
        this.skipCount = totalCount;
        if (this.skipCount >= this.totalItems) {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.noMore = true;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
            return;
        }
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledUpActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.loadData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledUpActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }


    // 获取可用下拉框数据源
    private loadSelectListData(): void {
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.outletSelectListCache, this._sessionService.tenantId), () => {
            return this._outletServiceServiceProxy.getOutletSelectList()
        }).then(result => {
            // 添加请选择数据源
            this.outletSelectListData = result;
            this.outletSelectListData.unshift(this._selectHelper.defaultSelectList());
        });
    }

    editHandler(bookingId: number) {
        this._router.navigate(['/booking/edit', bookingId]);
    }

    // 复制预约
    copyBooking(index) {
        this.copying = true;
        const bookingId = this.organizationBookingResultData[index].id;
        const input = new CreateOrUpdateBookingInput();

        this.message.confirm(this.l('Booking.Copy.Confirm'), (isCopy) => {
            if (!isCopy) {
                this.copying = false;
                return;
            }

            this._organizationBookingServiceProxy
                .getBookingForEdit(bookingId)
                .subscribe(result => {

                    input.booking = result.booking;
                    input.booking.id = 0;
                    input.bookingPictures = result.bookingPictures;
                    input.items = result.items;
                    if (input.items) {
                        for (let i = 0; i < input.items.length; i++) {
                            input.items[i].id = 0;
                            input.items[i].bookingId = 0;
                        }
                    }

                    // 创建预约
                    this._organizationBookingServiceProxy
                        .createOrUpdateBooking(input)
                        .subscribe(() => {
                            this.copying = false;
                            this.loadData();
                            this.notify.success(this.l('Booking.Copy.Success'));
                        });
                });
        });
    }

    // 删除预约
    removeBooking(index) {
        this.deleting = true;
        const bookingId = this.organizationBookingResultData[index].id;
        this.message.confirm(this.l('Booking.Delete.Confirm'), (isDelete) => {
            if (!isDelete) {
                this.deleting = false;
                return;
            }
            this._organizationBookingServiceProxy
                .deleteBooking(bookingId)
                .subscribe(() => {
                    this.deleting = false;
                    this.loadData();
                    this._localStorageService.removeItem(abp.utils.formatString(AppConsts.bookingSelectListCache, this._sessionService.tenantId));
                    this.notify.success(this.l('DeleteSuccess'));
                });
        });
    }

    onPageChange(index: number): void {
        this.currentPage = index;
        this.skipCount = this.maxResultCount * (this.currentPage - 1);
        this.loadData();
    }

    batchConfirmStateHanlder(batchConfirmState: boolean): void {
        if (batchConfirmState) {
            this.skipCount = this.maxResultCount * this.updateDataIndex;
            this.loadData();
        }
    }

    /* 移动端 */
    showDetail(id: number): void {
        const url = '/booking/detail/' + id;
        url.substring
        if (!ClientTypeHelper.isWeChatMiniProgram) {
            this._router.navigate([url]);
        } else {
            wx.miniProgram.redirectTo({
                url: `/pages/business-center/business-center?route=${encodeURIComponent(url)}`
            })
        }
    }

    setActionFlag(index: number) {
        this.actionFlag[index] = !this.actionFlag[index];
        this.actionFlag.forEach((element, i) => {
            if (i !== index) {
                this.actionFlag[i] = false;
            } else {
                this.actionFlag[index] = !!this.actionFlag[index];
            }
        });
    }

    showShareModel(bookingId: number): void {
        const shareUrl = AppConsts.userCenterUrl + '/booking/' + bookingId;
        this.mobileShareBookingModel.show(shareUrl);
    }

    showMobileConfirmOrderModel(bookingId: number, indexI: number): void {
        this.updateDataIndex = indexI;
        this.mobileConfirmOrderModel.show(bookingId);
    }

}
