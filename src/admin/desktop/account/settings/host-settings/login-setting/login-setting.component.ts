import { Component, OnInit, Injector, ViewEncapsulation, ViewChild, Input, Output, Injectable } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { AppConsts } from "shared/AppConsts";
import { SortDescriptor } from "@progress/kendo-data-query/dist/es/sort-descriptor";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid/dist/es/change-event-args.interface";
import { HostSettingsServiceProxy, HostSettingsEditDto, ExternalAuthenticationEditDto, CommonLookupServiceProxy } from "shared/service-proxies/service-proxies";
import { AppStorageService } from "shared/services/storage.service";
import { HostSettingService } from "shared/services/get-host-settings.service";

@Component({
    selector: 'login-setting',
    templateUrl: './login-setting.component.html'
})
export class LoginSettingComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _localStorage: AppStorageService,
        public _hostSettingService: HostSettingService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._hostSettingService.loadHostSettings();
        this._hostSettingService.loadEditions();
        this._hostSettingService.loadActions();
    }

    private editedRowIndex: number;
    private pageSizes: number[] = AppConsts.grid.pageSizes;
    private previousNext: boolean = true;
    private pageSize: number = this._localStorage.getStorageValue("Host.Login.Setting.take") ? this._localStorage.getStorageValue("Host.Login.Setting.take") : AppConsts.grid.defaultPageSize;
    private skip: number = this._localStorage.getStorageValue("Host.Login.Setting.skip") ? this._localStorage.getStorageValue("Host.Login.Setting.skip") : 0;
    public sort: Array<SortDescriptor> = [];

    protected editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex);
    }

    protected cancelHandler({ sender, rowIndex }) {
        this._hostSettingService.loadHostSettings();
        sender.closeRow(rowIndex);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
    }

    protected saveHandler({ sender, rowIndex, dataItem, isNew }) {
        this._hostSettingService.updateExternal(dataItem);
        sender.closeRow(rowIndex);
    }

    public onStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.skip = skip;
        this.pageSize = take;
        this.sort = sort;

        // 把用户点击后的skip保存在localstorage中
        this._localStorage.setStorageValue("Host.Login.Setting.skip", this.skip);
        this._localStorage.setStorageValue("Host.Login.Setting.take", this.pageSize);
    }
}
