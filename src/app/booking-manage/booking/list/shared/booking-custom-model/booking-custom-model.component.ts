import * as _ from 'lodash';

import { AfterViewInit, Component, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BatchConfirmInput, BookingListDto, EntityDtoOfInt64, Gender, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { DataStateChangeEvent, EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { ModalDirective } from 'ngx-bootstrap';
import { Moment } from 'moment';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { SortDescriptor } from '@progress/kendo-data-query';
import { AppSessionService } from 'shared/common/session/app-session.service';

@Component({
    selector: 'xiaoyuyue-booking-custom-model',
    templateUrl: './booking-custom-model.component.html',
    styleUrls: ['./booking-custom-model.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class BookingCustomModelComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    creationTime: any;
    hourOfDay: string;
    batchConfirmInput: BatchConfirmInput = new BatchConfirmInput();
    batchConfirmCount = 0;
    bookingCustomListData = new AppGridData();
    bookingDate: Moment;
    bookingId: number;
    bookingItem: BookingListDto = new BookingListDto();
    bookingName: string;
    confirmOrderText = this.l('Batch');
    creationEndDate: Moment;
    creationStartDate: any;
    customerName: string;
    endMinute: number;
    gender: Gender;
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(this._sessionService);
    isBatchConfirmFlag = false;
    isShowModelFlag = false;
    phoneNumber: string;
    startMinute: number;
    status: Status[] = [OrgBookingOrderStatus.WaitConfirm, OrgBookingOrderStatus.ConfirmSuccess, OrgBookingOrderStatus.ConfirmFail, OrgBookingOrderStatus.Cancel, OrgBookingOrderStatus.Complete];

    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('bookingCustomModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _sessionService: AppSessionService

    ) {
        super(injector);
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.initFlatpickr();
    }

    ngOnDestroy() {
        if (this.creationTime) {
            this.creationTime.destroy();
        }
    }

    loadData(): void {
        this.creationStartDate = this.creationStartDate ? moment(this.creationStartDate) : undefined;
        this.bookingCustomListData.query(() => {
            return this._orgBookingOrderServiceProxy
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
                ).map(response => {
                    const gridData = (<GridDataResult>{
                        data: response.items,
                        total: response.totalCount
                    });
                    return gridData;
                });
        }, true);
        if (typeof this.creationStartDate === 'object') {
            this.creationStartDate = this.creationStartDate.format('YYYY-MM-DD');
        }
    }

    initFlatpickr() {
        this.creationTime = $('.creationTime').flatpickr({
            'locale': LocalizationHelper.getFlatpickrLocale(),
            // clickOpens: false,
            onClose: (element) => {
                $(this.creationTime.input).blur();
            },
            onOpen: (dateObj, dateStr) => {
                this.creationStartDate = null;
            }
        })
    }

    public showModel(bookingItem: BookingListDto): void {
        this.bookingItem = bookingItem;
        if (bookingItem.id) {
            this.bookingId = bookingItem.id;
        }
        this.loadData();
        this.modal.show();
        // this.isShowModelFlag = true;
    }

    public hideModel(): void {
        // this.isShowModelFlag = false;
        this.modal.hide();
        this.isShowModelHander.emit(this.isShowModelFlag);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;
        this.loadData();
    }
}
