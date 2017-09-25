import { ActivatedRoute, Router } from '@angular/router';
import { ActiveOrDisableInput, BookingEditDto, BookingPictureEditDto, ContactorEditDto, GetBookingDetailOutput, OrgBookingServiceProxy, OutletEditDto, OutletServiceServiceProxy } from 'shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { MobileConfirmOrderModelComponent } from '../shared/mobile-confirm-order-model/mobile-confirm-order-model.component';
import { MobileShareBookingModelComponent } from 'app/booking-manage/booking/list/shared/mobile-share-booking-model/share-booking-model.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.scss'],
    animations: [accountModuleAnimation()],
})
export class BookingDetailComponent extends AppComponentBase implements OnInit {
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
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getBookingId();
        this.getBookingDetailData();
    }

    //   获取bookingID
    getBookingId(): void {
        this.bookingId = this._route.snapshot.paramMap.get('id');
        this.shareUrl = AppConsts.shareBaseUrl + '/booking/' + this.bookingId;
    }

    getBookingDetailData(): void {
        this._orgBookingServiceProxy
            .getBookingDetail(+this.bookingId)
            .subscribe(result => {
                this.bookingForEditData = result;
                this.availableBookingTime = this.bookingForEditData.availableBookingTime;
                this.bookingPictures = this.bookingForEditData.pictures;
            });
    }

    // 获取门店信息
    getOutletForEditData(outletId: number): void {
        this._outletServiceServiceProxy
            .getOutletForEdit(outletId)
            .subscribe(result => {
                this.outletData = result.outlet;
                this.contactData = result.contactors;
                console.log(this.contactData);
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
                this.notify.success('已关闭预约!');
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
                this.notify.success('已开启预约!');
            });
    }

    // 删除预约
    removeBooking(): void {
        this.message.confirm('确认删除此预约', result => {
            if (result) {
                this._orgBookingServiceProxy
                    .deleteBooking(+this.bookingId)
                    .subscribe(result => {
                        this._router.navigate(['/booking/list']);
                        this.notify.success('删除成功');
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
}
