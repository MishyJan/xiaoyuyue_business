import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HostSettingsServiceProxy, CommonLookupServiceProxy, ComboboxItemDto, SendTestEmailInput, HostSettingsEditDto, ExternalAuthenticationEditDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import * as moment from "moment";
import { SortDescriptor } from "@progress/kendo-data-query/dist/es/sort-descriptor";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid/dist/es/change-event-args.interface";
import { State } from "@progress/kendo-data-query/dist/es/state";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid'
import { HostSettingService } from "shared/services/get-host-settings.service";
import { AppTimezoneScope } from "shared/AppEnums";

@Component({
    templateUrl: "./host-settings.component.html",
    animations: [appModuleAnimation()]
})
export class HostSettingsComponent extends AppComponentBase implements OnInit {
    xxx: string;
    gridState: State;
    editService: any;

    loading: boolean = false;
    hostSettings: HostSettingsEditDto;
    editions: ComboboxItemDto[] = undefined;
    testEmailAddress: string = undefined;
    showTimezoneSelection = abp.clock.provider.supportsMultipleTimezone;
    defaultTimezoneScope: AppTimezoneScope = AppTimezoneScope.Application;

    usingDefaultTimeZone: boolean = false; 
    initialTimeZone: string = undefined;

    constructor(
        injector: Injector,
        public _appSessionService: AppSessionService,
        public _hostSettingService: HostSettingService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.testEmailAddress = this._appSessionService.user.emailAddress;
        this.showTimezoneSelection = abp.clock.provider.supportsMultipleTimezone;
        this._hostSettingService.loadHostSettings();
        this._hostSettingService.loadEditions();
    }

}
