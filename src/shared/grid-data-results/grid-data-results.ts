import 'rxjs/Rx';

import { DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Inject, Injectable, OpaqueToken, Optional } from '@angular/core';

import { BehaviorSubject } from 'rxjs/Rx';
import { DatetimeHelper } from '@shared/helpers/DatetimeHelper';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { toODataString } from '@progress/kendo-data-query';

@Injectable()
export class AppGridData extends BehaviorSubject<GridDataResult> {

    constructor() {
        super(null);
    }

    /**
     * 返回gridData数据
     * @param getUsersForGrid 接收一个函数，此函数去获取api数据
     */

    public query(getForGrid: () => any, transform: boolean = false) {
        if (transform) {
            getForGrid().subscribe(x => super.next(x));
            return;
        }

        getForGrid()
            .map(response => {
                let dataResult = (<GridDataResult>{
                    data: response.items,
                    total: response.totalCount
                });
                return dataResult;
            }).subscribe(x => super.next(x));
    }
}