import * as _ from 'lodash';

import { AfterViewInit, Component, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BatchConfirmInput, BookingListDto, EntityDtoOfInt64, Gender, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { DataStateChangeEvent, EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { ModalDirective } from 'ngx-bootstrap';
import { Moment } from 'moment';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'xiaoyuyue-booking-custom-model',
    templateUrl: './booking-custom-model.component.html',
    styleUrls: ['./booking-custom-model.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class BookingCustomModelComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    bookingId: number;
    customerName: string;
    creationStartDate: any;

    creationTimePicker: any;
    bookingCustomListData = new AppGridData();
    bookingItem: BookingListDto = new BookingListDto();

    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(this._sessionService);
    status: Status[] = [OrgBookingOrderStatus.WaitConfirm, OrgBookingOrderStatus.ConfirmSuccess, OrgBookingOrderStatus.ConfirmFail, OrgBookingOrderStatus.Cancel, OrgBookingOrderStatus.Complete];
    displayStatus: string[] = [this.l(OrgBookingOrderStatus.WaitConfirmLocalization),
    this.l(OrgBookingOrderStatus.ConfirmSuccessLocalization),
    this.l(OrgBookingOrderStatus.WaitCommentLocalization),
    this.l(OrgBookingOrderStatus.CancelLocalization),
    this.l(OrgBookingOrderStatus.CompleteLocalization)];

    searching = false;

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
        if (this.creationTimePicker) {
            this.creationTimePicker.destroy();
        }
    }

    loadData(): void {
        this.creationStartDate = this.creationStartDate ? moment(this.creationStartDate) : undefined;
        this.searching = true;
        this.bookingCustomListData.query(() => {
            return this._orgBookingOrderServiceProxy
                .getOrders(
                this.bookingId,
                undefined,
                this.customerName,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                this.creationStartDate,
                this.creationStartDate,
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
        }, true, () => {
            this.searching = false;
        });

        if (typeof this.creationStartDate === 'object') {
            this.creationStartDate = this.creationStartDate.format('YYYY-MM-DD');
        }
    }

    initFlatpickr() {
        this.creationTimePicker = $('.creationTime').flatpickr({
            'locale': LocalizationHelper.getFlatpickrLocale(),
            onClose: (element) => {
                $(this.creationTimePicker.input).blur();
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
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;
        this.loadData();
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
}
