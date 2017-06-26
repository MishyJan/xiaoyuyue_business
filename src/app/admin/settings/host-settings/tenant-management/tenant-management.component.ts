import { Component, OnInit, Injector, ViewEncapsulation, ViewChild, Input, Output } from '@angular/core';
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
  selector: 'tenant-management',
  templateUrl: './tenant-management.component.html'
})
export class TenantManagementComponent extends AppComponentBase implements OnInit {
  @Input()
  hostSettings: object;

  defaultTimezoneScope: AppTimezoneScope = AppTimezoneScope.Tenant;
  editions: ComboboxItemDto[] = undefined;

  constructor(
    injector: Injector,
    private _hostSettingService: HostSettingService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._hostSettingService.loadEditions();
  }
}
