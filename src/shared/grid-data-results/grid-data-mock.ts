import { HostSettingsEditDto, HostSettingsServiceProxy } from 'shared/service-proxies/service-proxies';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GridDataResult } from '@progress/kendo-angular-grid/dist/es/data.collection';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GridDataMock extends BehaviorSubject<GridDataResult>  {

    constructor() {
        super(null);
    }

    public query(testData): void {
        this.getlanguagesForGrid(testData)
            .subscribe(x => super.next(x));
    }

    private getlanguagesForGrid(data): Observable<GridDataResult> {

        var gridData = (<GridDataResult>{
            data: data,
            total: data.length,
        });
        return Observable.of(gridData);
    }
}