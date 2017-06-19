/* tslint:disable:no-unused-variable */
import { Component, OnInit, Injector, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { TenantSettingsComponent } from './tenant-settings.component';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { TimeZoneComboComponent } from "admin/shared/common/timing/timezone-combo.component";
import { FileSelectDirective } from '@node_modules/ng2-file-upload';
import { FormsModule }    from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { Http, HttpModule } from '@angular/http';
import { TenantSettingsServiceProxy, HostSettingsServiceProxy, DefaultTimezoneScope, TenantSettingsEditDto, SendTestEmailInput, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { BrowserModule } from "@angular/platform-browser";
import { TokenService } from "abp-ng2-module/src/auth/token.service";
import { AppSessionService } from "shared/common/session/app-session.service";
import { AbpMultiTenancyService } from "abp-ng2-module/src/multi-tenancy/abp-multi-tenancy.service";
import { LocalizationService } from "abp-ng2-module/src/localization/localization.service";
import { PermissionCheckerService } from "abp-ng2-module/src/auth/permission-checker.service";
import { FeatureCheckerService } from "abp-ng2-module/src/features/feature-checker.service";
import { NotifyService } from "abp-ng2-module/src/notify/notify.service";
import { SettingService } from "abp-ng2-module/src/settings/setting.service";
import { MessageService } from "abp-ng2-module/src/message/message.service";

describe('App: TenantSettings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        GridModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot()
      ],
      declarations: [
        TenantSettingsComponent,
        TimeZoneComboComponent,
        FileSelectDirective
      ],
      providers: [
        TenantSettingsServiceProxy,
        TokenService,
        SessionServiceProxy,
        AbpMultiTenancyService,
        AppSessionService,
        LocalizationService,
        PermissionCheckerService,
        FeatureCheckerService,
        NotifyService,
        SettingService,
        MessageService,
      ]
    }).compileComponents();
  });

  it('should create TenantSettingsComponent', async(() => {
    let fixture = TestBed.createComponent(TenantSettingsComponent);
    let TenantSettings = fixture.debugElement.componentInstance;
    expect(TenantSettings).toBeTruthy();
  }));

  it('Whether the data exists', async(() => {
    let fixture = TestBed.createComponent(TenantSettingsComponent);
    let TenantSettings = fixture.debugElement.componentInstance;
    expect(TenantSettings.title).toBe('Hello World');
    expect(TenantSettings.loginProviderData.value.data[0].providerName).toEqual('Facebook');
  }))
});
