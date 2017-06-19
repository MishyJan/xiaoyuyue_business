import * as moment from 'moment';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';

import { BehaviorSubject } from 'rxjs/Rx';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { toODataString } from '@progress/kendo-data-query';
import { DatetimeHelper } from '@shared/helpers/DatetimeHelper';
import { FormatArgumentHelper } from '@shared/helpers/UrlHelper';

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