import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { PagedResultDtoOfNameValueDto, NameValueDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process, SortDescriptor, orderBy, toODataString } from '@progress/kendo-data-query';
import { AppGridData } from "shared/grid-data-results/grid-data-results";

export interface ICommonLookupModalOptions {
    title?: string;
    isFilterEnabled?: boolean;
    dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => Observable<PagedResultDtoOfNameValueDto>;
    canSelect?: (item: NameValueDto) => boolean | Observable<boolean>;
    loadOnStartup?: boolean;
    pageSize?: number;
}

@Component({
    selector: 'commonLookupModal',
    templateUrl: './common-lookup-modal.component.html',
})
export class CommonLookupModalComponent extends AppComponentBase {

    static defaultOptions: ICommonLookupModalOptions = {
        dataSource: null,
        canSelect: () => true,
        loadOnStartup: true,
        isFilterEnabled: true,
        pageSize: AppConsts.grid.defaultPageSize
    };

    @Output() itemSelected: EventEmitter<NameValueDto> = new EventEmitter<NameValueDto>();

    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('table') table: ElementRef;

    private _$table: JQuery;

    options: ICommonLookupModalOptions;

    filterText: string = '';
    tenantId?: number;
    lookupData: AppGridData = new AppGridData();
    loading = false;

    buttonCount: number = 5;
    info: boolean = true;
    type: 'numeric';
    pageSizes: number[] = AppConsts.grid.pageSizes;
    previousNext: boolean = true;
    pageSize: number = 5;
    skip: number = 0;

    public sort: Array<SortDescriptor> = [];

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    configure(options: ICommonLookupModalOptions): void {
        this.options = $.extend(
            true,
            {
                title: this.l('SelectAnItem')
            },
            CommonLookupModalComponent.defaultOptions,
            options
        );

    }

    show(): void {
        if (!this.options) {
            throw Error('Should call CommonLookupModalComponent.configure once before CommonLookupModalComponent.show!');
        }

        this.modal.show();
        if (this.options.loadOnStartup) {
            this.refreshTable();
        }
    }

    refreshTable(): void {
        this.loadMembersData();
    }

    close(): void {
        this.modal.hide();
    }

    selectItem(item: NameValueDto) {
        var boolOrPromise = this.options.canSelect(item);
        if (!boolOrPromise) {
            return;
        }

        if (boolOrPromise === true) {
            this.itemSelected.emit(item);
            this.close();
            return;
        }

        //assume as observable
        this.loading = true;
        (boolOrPromise as Observable<boolean>)
            .finally(() => this.loading = false)
            .subscribe(result => {
                if (result) {
                    this.itemSelected.emit(item);
                    this.close();
                }
            });
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.skip = skip;
        this.pageSize = take;
        this.sort = sort;

        this.loadMembersData();
    }

    private loadMembersData(): void {
        let getDataFun = this.options.dataSource(this.skip, this.pageSize, this.filterText, this.tenantId);
        let loadCommonLookupData = () => {
            let maxResultCount, skipCount, sorting;
            let state = { skip: this.skip, take: this.pageSize };
            if (state) {
                maxResultCount = state.take;
                skipCount = state.skip
            }
            return getDataFun.map(response => {
                let gridData = (<GridDataResult>{
                    data: response.items,
                    total: response.totalCount
                });
                return gridData;
            });

        };
        // , this.filterText, getDataFun
        this.lookupData.query(loadCommonLookupData, true);
    }
}