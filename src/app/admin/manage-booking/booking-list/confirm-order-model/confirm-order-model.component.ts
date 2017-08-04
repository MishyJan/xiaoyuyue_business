import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { OrgBookingOrderServiceProxy, Gender2, Status2 } from 'shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppConsts } from 'shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';
import { AppGridData } from '../../../../../shared/grid-data-results/grid-data-results';
import { OrgBookingOrderStatus } from 'shared/AppEnums';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
    selector: 'xiaoyuyue-confirm-order-model',
    templateUrl: './confirm-order-model.component.html',
    styleUrls: ['./confirm-order-model.component.scss']
})
export class ConfirmOrderModelComponent extends AppComponentBase implements OnInit {
    @Output() isShowModelHander: EventEmitter<boolean> = new EventEmitter();
    isShowModelFlag: boolean = false;
    wait4ComfirmOrderListData: AppGridData;
    status: Status2[] = [OrgBookingOrderStatus.State1];
    creationDate: moment.Moment;
    skipCount: number = 0;
    maxResultCount: number = AppConsts.grid.defaultPageSize;
    sorting: Array<SortDescriptor> = [];
    gender: Gender2;
    phoneNumber: string;
    endMinute: number;
    startMinute: number;
    bookingDate: moment.Moment;
    customerName: string;
    bookingId: number;

    constructor(
        injector: Injector,
        private _orgBookingOrderServiceProxy: OrgBookingOrderServiceProxy,
        private _orgConfirmOrderGridDataResult: AppGridData
    ) {
        super(injector);
    }

    ngOnInit() {
        this.wait4ComfirmOrderListData = this._orgConfirmOrderGridDataResult;
    }

    loadData(): void {
        let state = { skip: this.skipCount, take: this.maxResultCount, sort: this.sorting };
        let maxResultCount, skipCount, sorting;
        if (state) {
            maxResultCount = state.take;
            skipCount = state.skip
            if (state.sort.length > 0 && state.sort[0].dir) {
                sorting = state.sort[0].field + " " + state.sort[0].dir
            }
        }

        let loadOrgConfirmOrderData = () => {
            return this._orgBookingOrderServiceProxy
                .getOrders2Booking(
                this.bookingId,
                this.customerName,
                this.bookingDate,
                this.startMinute,
                this.endMinute,
                this.phoneNumber,
                this.gender,
                this.creationDate,
                this.status,
                sorting,
                maxResultCount,
                skipCount
                ).map(response => {
                    let gridData = (<GridDataResult>{
                        data: response.bookingOrders.items,
                        total: response.bookingOrders.totalCount
                    });
                    return gridData;
                });
        }

        this._orgConfirmOrderGridDataResult.query(loadOrgConfirmOrderData, true);
    }

    showModel(bookingId: number): void {
        if (!bookingId) {
            return;
        }
        this.bookingId = bookingId;
        this.loadData();
        this.isShowModelFlag = true;
    }

    hideModel(): void {
        this.isShowModelFlag = false;
    }
}
