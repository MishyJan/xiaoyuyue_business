import 'assets/swiper/js/swiper.min'

import { ActivatedRoute, Router } from '@angular/router';
import { ActiveOrDisableInput, BookingEditDto, BookingPictureEditDto, ContactorEditDto, GetBookingDetailOutput, OrgBookingServiceProxy, OutletEditDto, OutletServiceServiceProxy } from 'shared/service-proxies/service-proxies';
import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ClientTypeHelper } from 'shared/helpers/ClientTypeHelper';
import { MobileConfirmOrderModelComponent } from '../shared/mobile-confirm-order-model/mobile-confirm-order-model.component';
import { MobileShareBookingModelComponent } from 'app/booking-manage/booking/list/shared/mobile-share-booking-model/share-booking-model.component';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

declare var Swiper: any;

@Component({
    selector: 'xiaoyuyue-booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.scss'],
    animations: [accountModuleAnimation()],
})
export class BookingDetailComponent extends AppComponentBase implements OnInit, AfterViewInit {
    hasAvailableTime = false;
    shareUrl: string;
    bookingPictures: string[] = [];
    availableBookingTime: string[] = [];
    bookingBaseInfo: BookingEditDto = new BookingEditDto();
    activeOrDisable: ActiveOrDisableInput = new ActiveOrDisableInput();
    contactData: ContactorEditDto[] = [];
    outletData: OutletEditDto = new OutletEditDto();
    bookingForEditData: GetBookingDetailOutput = new GetBookingDetailOutput();
    bookingId: string;

    @ViewChild('mobileConfirmOrderModel') mobileConfirmOrderModel: MobileConfirmOrderModelComponent;
    @ViewChild('mobileShareBookingModel') mobileShareBookingModel: MobileShareBookingModelComponent;

    constructor(
        private injector: Injector,
        private _router: Router,
        private _route: ActivatedRoute,
        private _orgBookingServiceProxy: OrgBookingServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _weChatShareTimelineService: WeChatShareTimelineService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getBookingId();
        this.getBookingDetailData();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.initSwiper();
        }, 500);
    }

    initSwiper(): void {
        const swiper = new Swiper('#tenantBgSwiperContainer', {
            autoplay: 2000,
            loop: true,
            pagination: '.swiper-pagination',
            paginationClickable: true
        });
    }

    //   获取bookingID
    getBookingId(): void {
        this.bookingId = this._route.snapshot.paramMap.get('id');
        this.shareUrl = AppConsts.userCenterUrl + '/booking/' + this.bookingId;
    }

    getBookingDetailData(): void {
        this._orgBookingServiceProxy
            .getBookingDetail(+this.bookingId)
            .subscribe(result => {
                this.bookingForEditData = result;
                this.availableBookingTime = this.bookingForEditData.availableBookingTime;
                if (this.availableBookingTime.length > 1) { this.hasAvailableTime = true; };
                this.bookingPictures = this.bookingForEditData.pictures;
                this.initWechatShareConfig();
            });
    }

    /* 显示或者隐藏多个预约时间 */
    toggleAvailableTime(): void {
        this.hasAvailableTime = !this.hasAvailableTime;
    }

    // 获取门店信息
    getOutletForEditData(outletId: number): void {
        this._outletServiceServiceProxy
            .getOutletForEdit(outletId)
            .subscribe(result => {
                this.outletData = result.outlet;
                this.contactData = result.contactors;
            })
    }

    // 禁用预约
    disabledBookingClass(): void {
        this.activeOrDisable.id = +this.bookingId;
        this.activeOrDisable.isActive = false;
        this._orgBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.getBookingDetailData();
                this.notify.success(this.l('Booking.CloseSuccess.Hint'));
            });
    }

    // 激活预约
    beforeBookingClass(): void {
        this.activeOrDisable.id = +this.bookingId;
        this.activeOrDisable.isActive = true;
        this._orgBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.getBookingDetailData();
                this.notify.success(this.l('Booking.OpenSuccess.Hint'));
            });
    }

    // 删除预约
    removeBooking(): void {
        this.message.confirm(this.l('Booking.ConfirmDelete.Hint'), result => {
            if (result) {
                this._orgBookingServiceProxy
                    .deleteBooking(+this.bookingId)
                    .subscribe(result => {
                        this._router.navigate(['/booking/list']);
                        this.notify.success(this.l('DeleteSuccess'));
                    })
            }
        })
    }

    showMobileConfirmOrderModel(bookingId: number): void {
        this.mobileConfirmOrderModel.show(bookingId);
    }

    batchConfirmStateHanlder(batchConfirmState: boolean): void {
        if (batchConfirmState) {
            this.getBookingDetailData();
        }
    }

    showShareModel(): void {
        this.mobileShareBookingModel.show(this.shareUrl);
    }

    bookingCustomerList(bookingId: number): void {
        this._router.navigate(['/bookingorder/list'], { queryParams: { bookingId: bookingId } });
    }

    initWechatShareConfig() {
        if (this.bookingForEditData && this.isWeiXin()) {
            this._weChatShareTimelineService.input.sourceUrl = document.location.href;
            this._weChatShareTimelineService.input.title = this.l('ShareMyBooking', this.bookingForEditData.name);
            this._weChatShareTimelineService.input.desc = this.l(this.bookingForEditData.name);
            this._weChatShareTimelineService.input.imgUrl = AppConsts.appBaseUrl + '/assets/common/images/logo.jpg';
            this._weChatShareTimelineService.input.link = AppConsts.userCenterUrl + '/booking/' + this.bookingId;
            this._weChatShareTimelineService.initWeChatShareConfig();
        }
    }

    // 跳转编辑预约
    RouteToCreateOrEdit(): void {
        const bookingUrl = '/booking/edit/' + this.bookingForEditData.id;
        if (!ClientTypeHelper.isWeChatMiniProgram) {
            this._router.navigate([bookingUrl]);
        } else {
            wx.miniProgram.redirectTo({
                url: `/pages/business-center/business-center?route=${encodeURIComponent(bookingUrl)}`
            })
        }
    }
}
