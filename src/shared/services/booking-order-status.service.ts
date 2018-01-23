import { EventEmitter, Injectable, Injector } from '@angular/core';

import { AppServiceBase } from 'shared/services/base.service';
import { BookingOrderStatus } from 'shared/AppEnums';
import { SelectHelperService } from 'shared/services/select-helper.service';
import { Status } from 'shared/service-proxies/service-proxies';

class SingleBookingStatus {
    value: any;
    displayText: any;
}

@Injectable()
export class BookingOrderStatusService extends AppServiceBase {
    public BookingOrderStatus: Status[] = [BookingOrderStatus.WaitConfirm,
    BookingOrderStatus.ConfirmSuccess,
    BookingOrderStatus.ConfirmFail,
    BookingOrderStatus.Cancel,
    // OrgBookingOrderStatus.WaitComment,
    BookingOrderStatus.Complete];

    public DisplayStatus: string[] = [this.l(BookingOrderStatus.WaitConfirmLocalization),
    this.l(BookingOrderStatus.ConfirmSuccessLocalization),
    this.l(BookingOrderStatus.WaitCommentLocalization),
    this.l(BookingOrderStatus.CancelLocalization),
    this.l(BookingOrderStatus.CompleteLocalization)];

    public DefaultItem: { value: string, displayText: string; };

    constructor(
        private injector: Injector,
        private _selectHelper: SelectHelperService
    ) {
        super(injector);
        this.getOrderStatusSelectList();
    }

    initDefaultItem(text: string) {
        this.DefaultItem = this._selectHelper.defaultListWithText(text);
    }

    // 获取预约状态下拉框数据源
    getOrderStatusSelectList(): Object[] {
        const orderStatusSelectList = [];
        this.BookingOrderStatus.forEach((value, index) => {
            const singleBookingStatus = new SingleBookingStatus();
            singleBookingStatus.value = value;
            singleBookingStatus.displayText = this.DisplayStatus[index];
            orderStatusSelectList.push(singleBookingStatus);
        });

        return orderStatusSelectList;
    }

    getOrderStatusSelectListWithDefault(): Object[] {
        const orderStatusSelectList = this.getOrderStatusSelectList();

        return orderStatusSelectList;
    }

    // 订单状态样式
    getTipsClass(status: number): any {
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