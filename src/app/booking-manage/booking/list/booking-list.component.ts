import * as _ from 'lodash';

import { ActiveOrDisableInput, BookingListDto, CreateOrUpdateBookingInput, OrgBookingServiceProxy, OutletServiceServiceProxy, PagedResultDtoOfBookingListDto, SelectListItemDto } from 'shared/service-proxies/service-proxies';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Injector, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BookingCustomModelComponent } from './shared/booking-custom-model/booking-custom-model.component';
import { ConfirmOrderModelComponent } from './shared/confirm-order-model/confirm-order-model.component';
import { LocalStorageService } from 'shared/utils/local-storage.service';
import { MobileConfirmOrderModelComponent } from './shared/mobile-confirm-order-model/mobile-confirm-order-model.component';
import { MobileShareBookingModelComponent } from './shared/mobile-share-booking-model/share-booking-model.component';
import { Moment } from 'moment';
import { NgxAni } from 'ngxani';
import { Observable } from 'rxjs/Rx';
import { PictureUrlHelper } from 'shared/helpers/PictureUrlHelper';
import { Router } from '@angular/router';
import { SelectHelper } from 'shared/helpers/SelectHelper';
import { ShareBookingModelComponent } from 'app/booking-manage/booking/create-or-edit/share-booking-model/share-booking-model.component';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/sort-descriptor';
import { Title } from '@angular/platform-browser';
import { appModuleSlowAnimation } from 'shared/animations/routerTransition';
import { element } from 'protractor';

@Component({
    selector: 'app-manage-booking',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.scss'],
    animations: [appModuleSlowAnimation()]
    //   changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookingListComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    allOrganizationBookingResultData: any[] = [];

    infiniteScrollDistance = 2;
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
    bookingActiveSelectListData: Object[] = SelectHelper.BoolList();
    bookingActiveSelectDefaultItem: object;

    organizationBookingResultData: BookingListDto[] = [];
    pictureDefaultBgUrl = '/assets/common/images/login/bg1.jpg';
    // pictureDefaultBgUrl: string = "/assets/common/images/admin/booking-bg.jpg";

    endCreationTime: any;
    startCreationTime: any;
    isActive: boolean;
    outletId: number;
    bookingName: string;

    maxResultCount = AppConsts.grid.defaultPageSize;
    skipCount = 0;
    sorting: string;
    totalItems = 0;
    currentPage = 0;
    slogan = '啥都没有，赶紧去创建预约吧';

    shareBaseUrl: string = AppConsts.shareBaseUrl + '/booking/';
    @ViewChild('confirmOrderModelComponent') ConfirmOrderModelComponent: ConfirmOrderModelComponent;
    @ViewChild('bookingCustomModelComponent') BookingCustomModelComponent: BookingCustomModelComponent;
    @ViewChild('shareBookingModel') shareBookingModel: ShareBookingModelComponent;
    @ViewChild('bookingBg') bookingBgElement: ElementRef;
    @ViewChild('mobileShareBookingModel') mobileShareBookingModel: MobileShareBookingModelComponent;
    @ViewChild('mobileConfirmOrderModel') mobileConfirmOrderModel: MobileConfirmOrderModelComponent;

    constructor(
        injector: Injector,
        private _ngxAni: NgxAni,
        private _router: Router,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _organizationBookingServiceProxy: OrgBookingServiceProxy,
        private _localStorageService: LocalStorageService,
        private _title: Title,
        private _sessionService: AppSessionService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingActiveSelectDefaultItem = SelectHelper.DefaultList();
        this.outletSelectListData.unshift(SelectHelper.DefaultSelectList());
        this.loadSelectListData();
    }

    ngAfterViewInit() {
        this.loadData();
        if (!this.isMobile()) {
            this.initFlatpickr();
        }
    }

    ngOnDestroy() {
        if (!this.isMobile() && this.bStartCreationTime && this.bEndCreationTime) {
            this.bStartCreationTime.destroy();
            this.bEndCreationTime.destroy();
        }
    }

    /**
     * desktop
     */
    initFlatpickr() {
        this.bStartCreationTime = $('.startCreationTime').flatpickr({
            'locale': 'zh',
            // clickOpens: false,
            onClose: (element) => {
                $(this.bStartCreationTime.input).blur();
            }
        })

        this.bEndCreationTime = $('.endCreationTime').flatpickr({
            'locale': 'zh',
            // clickOpens: false,
            onClose: (element) => {
                $(this.bEndCreationTime.input).blur();
            }
        })
    }

    // 正面翻转到背面
    flipToBack(flipAni: any, event) {
        this._ngxAni.to(flipAni, .6, {
            transform: 'rotateY(180deg)',
            transition: 'transform 1s cubic-bezier(0.18, 1.24, 0.29, 1.44);'
        });
    }

    // 背面翻转到正面
    flipToFront(flipAni: any, event) {
        this._ngxAni.to(flipAni, .6, {
            transform: 'rotateY(0)',
            transition: 'transform 1s cubic-bezier(0.18, 1.24, 0.29, 1.44);'
        });
    }

    // 禁用预约样式
    disabledBookingClass(index) {
        // this._ngxAni.to(disabledAni, .6, {
        //     // 'filter': 'grayscale(100%)'
        // });
        this.activeOrDisable.id = this.organizationBookingResultData[index].id;
        this.activeOrDisable.isActive = false;
        this._organizationBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.notify.success('已关闭预约!');
                this.loadData();
            });
    }

    // 显示禁用之前预约样式
    beforeBookingClass(index) {
        // this._ngxAni.to(disabledAni, .6, {
        //     'filter': 'grayscale(0)'
        // });
        this.activeOrDisable.id = this.organizationBookingResultData[index].id;
        this.activeOrDisable.isActive = true;
        this._organizationBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.notify.success('已开启预约!');
                this.loadData();
            });
    }

    // 显示待确认model
    showConfirmOrderHandler(bookingId: number): void {
        this.ConfirmOrderModelComponent.showModel(bookingId);
    }

    // 待确认model弹窗，若关闭应该刷新数据
    isShowComfirmOrderModelHandler(flag: boolean): void {
        if (!flag) {
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
        if (val1 <= 0 || val2 <= 0) { return 30; };
        const maxResult = 74;
        const ratio = maxResult / 100;
        this.countOverbrimTopValue = Math.round(32 - ((100 - val1 / (val1 + val2) * 100)) * ratio);
        return this.countOverbrimTopValue;
    }

    private countOverbrimState(val1, val2): any {
        let temp = Math.round(100 - val1 / (val1 + val2) * 100);
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
        return pictureUrl === '' ? this.pictureDefaultBgUrl : PictureUrlHelper.getBookingListPicCompressUrl(pictureUrl);
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

    loadData(): void {
        this.startCreationTime = this.startCreationTime ? moment(this.startCreationTime) : undefined;
        this.endCreationTime = this.endCreationTime ? moment(this.endCreationTime) : undefined;

        this._organizationBookingServiceProxy
            .getBookings(this.bookingName, this.outletId, this.isActive, this.startCreationTime, this.endCreationTime, this.sorting, this.maxResultCount, this.skipCount)
            .subscribe(result => {
                const self = this;
                this.totalItems = result.totalCount;
                this.organizationBookingResultData = result.items;

                if (this.organizationBookingResultData.length > 0) {
                    this.allOrganizationBookingResultData.push(this.organizationBookingResultData);
                }

                if (typeof this.startCreationTime === 'object') {
                    this.startCreationTime = this.startCreationTime.format('YYYY-MM-DD');
                    this.endCreationTime = this.endCreationTime.format('YYYY-MM-DD');
                }

            });
    }

    // 获取可用下拉框数据源
    private loadSelectListData(): void {
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.outletSelectListCache, this._sessionService.tenantId), () => {
            return this._outletServiceServiceProxy.getOutletSelectList()
        }).then(result => {
            // 添加请选择数据源
            this.outletSelectListData = result;
            this.outletSelectListData.unshift(SelectHelper.DefaultSelectList());
        });
    }

    editHandler(bookingId: number) {
        this._router.navigate(['/booking/edit', bookingId]);
    }

    // 复制预约
    copyBooking(index) {
        const bookingId = this.organizationBookingResultData[index].id;
        const input = new CreateOrUpdateBookingInput();

        this.message.confirm('是否要复制当前预约', (isCopy) => {
            if (isCopy) {
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
                                this.loadData();
                                this.notify.success('复制成功！');
                            });
                    });
            }
        });
    }

    // 删除预约
    removeBooking(index) {
        const bookingId = this.organizationBookingResultData[index].id;
        this.message.confirm('是否要删除当前预约', (isDelete) => {
            if (isDelete) {
                this._organizationBookingServiceProxy
                    .deleteBooking(bookingId)
                    .subscribe(() => {
                        this.loadData();
                        this.notify.success('删除成功！');
                    });
            }
        });
    }

    onPageChange(index: number): void {
        this.currentPage = index;
        this.skipCount = this.maxResultCount * (this.currentPage - 1);
        this.loadData();
    }

    batchConfirmStateHanlder(batchConfirmState: boolean): void {
        if (batchConfirmState) {
            this.loadData();
        }
    }

    /* 移动端 */
    showDetail(id: number): void {
        this._router.navigate(['/booking/detail', id]);
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
        const shareUrl = AppConsts.shareBaseUrl + '/booking/' + bookingId;
        this.mobileShareBookingModel.show(shareUrl);
    }

    showMobileConfirmOrderModel(bookingId: number): void {
        this.mobileConfirmOrderModel.show(bookingId);
    }

    public onScrollDown(): void {
        if (this.skipCount > (this.totalItems - this.maxResultCount)) {
            // this.isLoaded = true;
            return;
        }
        this.skipCount += this.maxResultCount;
        this.loadData();

    }

    /* 公用代码 */
    // 判断是否有移动端的DOM元素
    isMobile(): boolean {
        if ($('.mobile-manage-booking').length > 0) {
            return true;
        };
        return false;
    }
}
