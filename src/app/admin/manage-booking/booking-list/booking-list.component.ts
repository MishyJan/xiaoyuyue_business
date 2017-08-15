import { AppConsts } from '@shared/AppConsts';
import { AppStorageService } from 'shared/services/storage.service';
import { Component, OnInit, Injector, ViewChild, ChangeDetectionStrategy, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from 'shared/animations/routerTransition';
import { AppComponentBase } from 'shared/common/app-component-base';
import { NgxAni } from 'ngxani';
import { OrgBookingServiceProxy, PagedResultDtoOfBookingListDto, BookingListDto, CreateOrUpdateBookingInput, OutletServiceServiceProxy, SelectListItemDto, ActiveOrDisableInput } from 'shared/service-proxies/service-proxies';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/sort-descriptor';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { SelectHelper } from 'shared/helpers/SelectHelper';
import { ShareBookingModelComponent } from 'app/admin/manage-booking/create-or-edit-booking/share-booking-model/share-booking-model.component';
import { ConfirmOrderModelComponent } from './confirm-order-model/confirm-order-model.component';
import { BookingCustomModelComponent } from './booking-custom-model/booking-custom-model.component';


@Component({
    selector: 'app-manage-booking',
    templateUrl: './booking-list.component.html',
    styleUrls: ['./booking-list.component.scss'],
    animations: [appModuleAnimation()]
    //   changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookingListComponent extends AppComponentBase implements OnInit, AfterViewInit {
    countOverbrimTopValue: number;
    bookingOverbrimValue = 0;
    // 保存预约列表背景图的比例
    bookingBgW = 384;
    bookingBgH = 214;

    activeOrDisable: ActiveOrDisableInput = new ActiveOrDisableInput();
    outletSelectDefaultItem: string;
    outletSelectListData: SelectListItemDto[];
    bookingActiveSelectListData: Object[] = SelectHelper.boolList();
    bookingActiveSelectDefaultItem: object;

    organizationBookingResultData: BookingListDto[];
    pictureDefaultBgUrl = '/assets/common/images/login/bg1.jpg';
    // pictureDefaultBgUrl: string = "/assets/common/images/admin/booking-bg.jpg";

    endCreationTime: any;
    startCreationTime: any;

    isActive: boolean;
    outletId: number;
    bookingName: string;

    maxResultCount = 8;
    skipCount = 0;
    sorting: string;
    totalItems = 0;
    currentPage = 0;

    shareBaseUrl: string = AppConsts.shareBaseUrl + '/booking/about/';
    @ViewChild('confirmOrderModelComponent') ConfirmOrderModelComponent: ConfirmOrderModelComponent;
    @ViewChild('bookingCustomModelComponent') BookingCustomModelComponent: BookingCustomModelComponent;
    @ViewChild('shareBookingModel') shareBookingModel: ShareBookingModelComponent;
    @ViewChild('bookingBg') bookingBgElement: ElementRef;

    constructor(
        injector: Injector,
        private _ngxAni: NgxAni,
        private _router: Router,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _organizationBookingServiceProxy: OrgBookingServiceProxy,
        private _appStorageService: AppStorageService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingActiveSelectDefaultItem = SelectHelper.defaultList();
    }

    ngAfterViewInit() {
        this.loadSelectListData();
        this.loadData();

        // $(".startCreationTime").flatpickr({
        //     "locale": "zh"
        // });
        // $(".endCreationTime").flatpickr({
        //     "locale": "zh"
        // });
    }

    private loadData(): void {
        this.startCreationTime = this.startCreationTime ? moment(this.startCreationTime) : undefined;
        this.endCreationTime = this.endCreationTime ? moment(this.endCreationTime) : undefined;

        this._organizationBookingServiceProxy
            .getBookings(this.bookingName, this.outletId, this.isActive, this.startCreationTime, this.endCreationTime, this.sorting, this.maxResultCount, this.skipCount)
            .subscribe(result => {
                const self = this;
                this.totalItems = result.totalCount;
                this.organizationBookingResultData = result.items;
                if (typeof this.startCreationTime === 'object') {
                    this.startCreationTime = this.startCreationTime.format('YYYY-MM-DD');
                    this.endCreationTime = this.endCreationTime.format('YYYY-MM-DD');
                }
            });
    }

    // 获取可用下拉框数据源
    private loadSelectListData(): void {
        this._appStorageService.getItem(AppConsts.outletSelectListCache, () => {
            return this._outletServiceServiceProxy.getOutletSelectList();
        }).subscribe(result => {
            // 添加请选择数据源
            const input = new SelectListItemDto();
            input.text = '请选择';
            input.value = '';
            this.outletSelectListData = result;
            this.outletSelectListData.unshift(input);
            this.outletSelectDefaultItem = result[0].value;
        });
    }

    getMoment(arg: string) {
        if (arg === undefined) { return undefined; }
        return moment(arg);
    }

    editHandler(bookingId: number) {
        this._router.navigate(['app/admin/booking/edit', bookingId]);
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
    disabledBookingClass(disabledAni: any, index) {
        this._ngxAni.to(disabledAni, .6, {
            'filter': 'grayscale(100%)'
        });
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
    beforeBookingClass(disabledAni: any, index) {
        this._ngxAni.to(disabledAni, .6, {
            'filter': 'grayscale(0)'
        });
        this.activeOrDisable.id = this.organizationBookingResultData[index].id;
        this.activeOrDisable.isActive = true;
        this._organizationBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.notify.success('已开启预约!');
                this.loadData();
            });
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

    onPageChange(index: number): void {
        this.currentPage = index;
        this.skipCount = this.maxResultCount * (this.currentPage - 1);
        this.loadData();
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

    public getOverbrimValue(val1, val2): string {
        if (val1 <= 0 || val2 <= 0) { return '0%'; };
        this.bookingOverbrimValue = Math.round(100 - val1 / (val1 + val2) * 100);
        return this.bookingOverbrimValue + '%';
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
        return pictureUrl === '' ? this.pictureDefaultBgUrl : pictureUrl;
    }
}
