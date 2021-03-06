import * as _ from 'lodash';

import { AfterViewInit, Component, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BatchConfirmInput, BookingListDto, EntityDtoOfInt64, Gender, OrgBookingOrderServiceProxy, Status } from 'shared/service-proxies/service-proxies';
import { DataStateChangeEvent, EditEvent, GridDataResult } from '@progress/kendo-angular-grid';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { BookingOrderStatus } from 'shared/AppEnums';
import { BookingOrderStatusService } from 'shared/services/booking-order-status.service';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { ModalDirective } from 'ngx-bootstrap';
import { Moment } from 'moment';
import { SelectHelperService } from 'shared/services/select-helper.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: 'xiaoyuyue-booking-custom-model',
    templateUrl: './booking-custom-model.component.html',
    styleUrls: ['./booking-custom-model.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class BookingCustomModelComponent extends AppComponentBase implements OnInit {
    bookingId: number;
    customerName: string;
    phoneNumber: string;
    bookingCustomCreationTimePicker: any;
    bookingCustomListData = new AppGridData();
    bookingItem: BookingListDto = new BookingListDto();

    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto(this.appSession);
    selectDefaultItem: { value: string, displayText: string; };
    status: Status;
    displayStatus: string[];
    orderStatusSelectList: Object[] = [];
    checkIn: boolean;
    selectCheckInDefaultItem: { value: boolean, displayText: string; };
    checkInSelectListData = this._selectHelper.checkInList();

    searching = false;

    @ViewChild('bookingCustomModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _selectHelper: SelectHelperService,
        private _orderStatusService: BookingOrderStatusService

    ) {
        super(injector);
    }

    ngOnInit() {
        this.getSelectListData();
    }

    // 获取预约状态下拉框数据源
    getSelectListData(): void {
        this.selectDefaultItem = this._selectHelper.defaultListWithText('Search.ChooseOrderStatus');
        this.selectCheckInDefaultItem = this._selectHelper.defaultListWithText('Search.ChooseCheckInStatus');
        this.displayStatus = this._orderStatusService.DisplayStatus;
        this.orderStatusSelectList = this._orderStatusService.getOrderStatusSelectList();
    }


    loadData(): void {
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
                this.phoneNumber,
                undefined,
                this.checkIn,
                undefined,
                undefined,
                this.getSearchStatusArray(),
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
    }

    public showModel(bookingItem: BookingListDto): void {
        this.bookingItem = bookingItem;
        if (bookingItem.id) {
            this.bookingId = bookingItem.id;
        }
        this.status = undefined;
        this.gridParam = new BaseGridDataInputDto(this.appSession);
        this.loadData();
        this.modal.show();
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;
        this.loadData();
    }

    getSearchStatusArray(): Status[] {
        if (!!this.status === false) {
            return [Status._1, Status._2, Status._3, Status._4, Status._5];
        }
        return [this.status];
    }
}
