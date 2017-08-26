import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { CurrentUserProfileEditDto, DefaultTimezoneScope, ProfileServiceProxy, UserLoginInfoDto } from "@shared/service-proxies/service-proxies";

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service'
import { AppTimezoneScope } from "shared/AppEnums";
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'mySettingsModal',
    templateUrl: './my-settings-modal.component.html'
})
export class MySettingsModalComponent extends AppComponentBase {

    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('mySettingsModal') modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    public active: boolean = false;
    public saving: boolean = false;

    public user: CurrentUserProfileEditDto;
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: AppTimezoneScope = AppTimezoneScope.User;
    private _initialTimezone: string = undefined;

    constructor(
        injector: Injector,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.user = result;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName != AppConsts.userManagement.defaultAdminUserName;
            this.modal.show();
        });
    }

    onShown(): void {
        $(this.nameInput.nativeElement).focus();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save(): void {
        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.user)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this._appSessionService.user.name = this.user.name;
                this._appSessionService.user.surname = this.user.nickName;
                this._appSessionService.user.userName = this.user.userName;
                this._appSessionService.user.emailAddress = this.user.emailAddress;

                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);

                if (abp.clock.provider.supportsMultipleTimezone && this._initialTimezone !== this.user.timezone) {
                    this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).done(() => {
                        window.location.reload();
                    });
                }
            });
    }
}