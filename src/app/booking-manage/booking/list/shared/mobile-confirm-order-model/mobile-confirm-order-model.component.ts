import { BatchConfirmInput, Gender, OrgBookingOrderListDto, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { ModalDirective } from 'ngx-bootstrap';
import { Moment } from 'moment';
import { OrgBookingOrderStatus } from 'shared/AppEnums';

@Component({
    selector: 'xiaoyuyue-mobile-confirm-order-model',
    templateUrl: './mobile-confirm-order-model.component.html',
    styleUrls: ['./mobile-confirm-order-model.component.scss']
})
export class MobileConfirmOrderModelComponent extends AppComponentBase implements OnInit {
    hourOfDay: string;
    totalItems: number;
    orderIds: number[] = [];
    orgBookingOrderData: OrgBookingOrderListDto[] = [];
    bookingDate: Moment;
    bookingId: number;
    bookingName: string;
    creationEndDate: Moment;
    creationStartDate: Moment;
    customerName: string;
    endMinute: number;
    gender: Gender;
    phoneNumber: string;
    startMinute: number;
    status: Status[] = [OrgBookingOrderStatus.WaitConfirm];
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(5, false);
    currentPage: number = 0;
    maxResultCount: number;

    @ViewChild('mobileConfirmOrderModel') mobileConfirmOrderModel: ModalDirective;
    @Output() batchConfirmStateHanlder: EventEmitter<boolean> = new EventEmitter();
    constructor(
        private injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.maxResultCount = this.gridParam.MaxResultCount;
    }

    ngAfterViewInit() {

    }

    loadData(): void {
        this._orgBookingOrderServiceProxy
            .getOrders(
            this.bookingId,
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
            this.status,
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount
            )
            .subscribe(result => {
                this.totalItems = result.totalCount;
                this.orgBookingOrderData = result.items;
            })
    }

    getProfilePictureUrl(profilePictureUrl: string): string {
        const defaultAvatar = 'assets/common/images/default-profile-picture.png';
        if (profilePictureUrl === '') {
            return defaultAvatar;
        }
        return profilePictureUrl;
    }

    batchConfirmBookingOrder(): void {
        let input: BatchConfirmInput = new BatchConfirmInput();
        this.orgBookingOrderData.forEach(element => {
            this.orderIds.push(element.id);
        });
        input.ids = this.orderIds
        this._orgBookingOrderServiceProxy.batchConfirmBookingOrder(input)
            .subscribe(result => {
                this.notify.success('确认成功');
                this.hide();
                this.orderIds = [];
                this.batchConfirmStateHanlder.emit(true);
                this.loadData();
            })
    }

    prevPage(): void {
        if (this.currentPage <= 0) {
            this.notify.warn('已经是第一页');
            return;
        }
        this.currentPage--;
        this.gridParam.SkipCount = this.maxResultCount * this.currentPage;
        this.loadData();
    }

    nextPage(): void {
        if (this.currentPage >= (this.totalItems / this.maxResultCount - 1)) {
            this.notify.warn('已经是最后一页');
            return;
        }
        this.currentPage++;
        this.gridParam.SkipCount = this.maxResultCount * this.currentPage;
        this.loadData();
    }

    onPageChange(index: number): void {
        this.currentPage = index;
        this.gridParam.SkipCount = this.maxResultCount * this.currentPage - 1;
        this.loadData();
    }

    show(bookingId: number): void {
        this.bookingId = bookingId;
        this.loadData();
        this.mobileConfirmOrderModel.show();
    }

    hide(): void {
        this.mobileConfirmOrderModel.hide();
    }

}