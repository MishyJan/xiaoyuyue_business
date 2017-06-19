/**
 * 作用：获取host下的所有设置，封装成service
 */
import { Injectable, Injector, OnInit } from '@angular/core';
import { HostSettingsServiceProxy, HostSettingsEditDto, ExternalAuthenticationEditDto, CommonLookupServiceProxy, ComboboxItemDto, SendTestEmailInput, SelectListItemDto } from "shared/service-proxies/service-proxies";
import { AppServiceBase } from "shared/services/base.service";
import { AppEnumSelectItemSource } from '@shared/AppEnums';
import { AppGridData } from "shared/grid-data-results/grid-data-results";
import { GridDataResult } from "@progress/kendo-angular-grid/dist/es/data.collection";
import { Observable } from "rxjs/Observable";

@Injectable()
export class HostSettingService extends AppServiceBase {
    hostLoginProviderData: AppGridData;
    hostSettings: HostSettingsEditDto;
    initialTimeZone: string = undefined;
    usingDefaultTimeZone: boolean = false;
    editions: ComboboxItemDto[] = undefined;
    activations: SelectListItemDto[] = undefined;

    constructor(
        injector: Injector,
        private _hostSettingService: HostSettingsServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy,
        private _externalHostLoginProviderDataResult: AppGridData,
        private _commonLookupServiceProxy: CommonLookupServiceProxy
    ) {
        super(injector);
    }
    ngOnInit() {
    }


    loadHostSettings(): void {
        this.hostLoginProviderData = this._externalHostLoginProviderDataResult;

        let loadHostSettingsData = () => {
            return this._hostSettingService
                .getAllSettings()
                .map(response => {
                    this.hostSettings = response;
                    let gridData = (<GridDataResult>{
                        data: response.externalAuthentication.externalAuthenticationProviders,
                        total: response.externalAuthentication.externalAuthenticationProviders.length
                    })
                    return gridData;
                })
        };

        this.hostLoginProviderData.query(loadHostSettingsData, true);
    }

    updateExternal(input): void {
        this._hostSettingService
            .updateExternalAuthentication(input)
            .subscribe(result => {
                this.loadHostSettings();
            })
    }

    loadActions() {
        this._commonLookupServiceProxy
            .getEnumSelectItemSource(AppEnumSelectItemSource.UserActivationOption)
            .subscribe(result => {
                this.activations = result;
                let notAssignedAction = new SelectListItemDto();
                notAssignedAction.text = this.l("Please_Choose");
                notAssignedAction.value = null;

                this.activations.unshift(notAssignedAction);
            });
    }

    // 获取版本
    loadEditions(): void {
        this._commonLookupService.getEditionsForCombobox()
            .subscribe((result) => {
                this.editions = result.items;
                let notAssignedEdition = new ComboboxItemDto();
                notAssignedEdition.value = null;
                notAssignedEdition.displayText = this.l("NotAssigned");

                this.editions.unshift(notAssignedEdition);
            }); 
    }

    sendTestEmail(testEmailAddress: string): void {
        let input = new SendTestEmailInput();
        input.emailAddress = testEmailAddress;
        this._hostSettingService.sendTestEmail(input).subscribe(result => {
            this.notify.info(this.l("TestEmailSentSuccessfully"));
        });
    };

    saveAll(): void {
        let hasVoucher = this.confirmRegisterVoucher();
        if (!hasVoucher) {
            return;
        }
        this._hostSettingService.updateAllSettings(this.hostSettings).subscribe(result => {
            this.notify.info(this.l('SavedSuccessfully'));

            if (abp.clock.provider.supportsMultipleTimezone && this.usingDefaultTimeZone && this.initialTimeZone !== this.hostSettings.general.timezone) {
                this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).done(function () {
                    window.location.reload();
                });
            }

        });
    }

    /**
     * 确认注册凭证
     * 第三方登录设置，登录凭证:用户名/邮箱/手机这三个CheckBox必须有一项必填
     * 否则弹出警告信息
     */
    confirmRegisterVoucher(): boolean {
        let userName = this.hostSettings.externalAuthentication.requiredUserName;
        let userEmail = this.hostSettings.externalAuthentication.requiredEmail;
        let userPhone = this.hostSettings.externalAuthentication.requiredTelephone;

        if (!userName && !userEmail && !userPhone) {
            this.message.warn("注册凭证必须要勾选一项", "警告");
            return false;
        }
        return true;
    }

}