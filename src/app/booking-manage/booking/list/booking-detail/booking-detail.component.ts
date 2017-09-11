import { ActiveOrDisableInput, BookingEditDto, BookingPictureEditDto, ContactorEditDto, GetBookingForEditOutput, OrgBookingServiceProxy, OutletEditDto, OutletServiceServiceProxy } from 'shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
    selector: 'xiaoyuyue-booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.scss']
})
export class BookingDetailComponent extends AppComponentBase implements OnInit {
    bookingPictures: BookingPictureEditDto[] = [];
    bookingBaseInfo: BookingEditDto = new BookingEditDto();
    activeOrDisable: ActiveOrDisableInput = new ActiveOrDisableInput();
    contactData: ContactorEditDto[] = [];
    outletData: OutletEditDto = new OutletEditDto();
    bookingForEditData: GetBookingForEditOutput = new GetBookingForEditOutput();
    bookingId: string;

    constructor(
        private injector: Injector,
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
    }

    getBookingDetailData(): void {
        this._orgBookingServiceProxy
            .getBookingForEdit(+this.bookingId)
            .subscribe(result => {
                this.bookingForEditData = result;
                this.bookingPictures = this.bookingForEditData.bookingPictures;
                this.bookingBaseInfo = this.bookingForEditData.booking;
                this.getOutletForEditData(this.bookingForEditData.booking.outletId);
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
    disabledBookingClass() {
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
    beforeBookingClass() {
        this.activeOrDisable.id = +this.bookingId;
        this.activeOrDisable.isActive = true;
        this._orgBookingServiceProxy
            .activedOrDisableBooking(this.activeOrDisable)
            .subscribe(result => {
                this.getBookingDetailData();
                this.notify.success('已开启预约!');
            });
    }

}
