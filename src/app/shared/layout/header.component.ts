import { ChangeUserLanguageDto, LinkedUserDto, ProfileServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppStorageService } from 'shared/services/storage.service';
import { ChangePasswordModalComponent } from './profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from './profile/change-profile-picture-modal.component';
import { LocalizationService } from '@abp/localization/localization.service';
import { Location } from '@angular/common';
import { LoginAttemptsModalComponent } from './login-attempts-modal.component';
import { MySettingsModalComponent } from './profile/my-settings-modal.component'
import { NotificationSettingsModalCompoent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';

@Component({
    templateUrl: './header.component.html',
    selector: 'header',
    styleUrls: [
        './header.component.less'
    ],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends AppComponentBase implements OnInit {

    @ViewChild('notificationSettingsModal') notificationSettingsModal: NotificationSettingsModalCompoent;

    @ViewChild('loginAttemptsModal') loginAttemptsModal: LoginAttemptsModalComponent;
    @ViewChild('changePasswordModal') changePasswordModal: ChangePasswordModalComponent;
    @ViewChild('changeProfilePictureModal') changeProfilePictureModal: ChangeProfilePictureModalComponent;
    @ViewChild('mySettingsModal') mySettingsModal: MySettingsModalComponent;

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin = false;

    shownLoginNameTitle = '';
    shownLoginName = '';
    profilePicture = '/assets/common/images/default-profile-picture.png';
    recentlyLinkedUsers: LinkedUserDto[];
    unreadChatMessageCount = 0;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    chatConnected = false;

    constructor(
        injector: Injector,
        private _sessionService: AbpSessionService,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _profileServiceProxy: ProfileServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _authService: AppAuthService,
        private _userNotificationHelper: UserNotificationHelper,
        private _appStorageService: AppStorageService,
        private _location: Location
    ) {
        super(injector);
    }

    ngOnInit() {
        this._userNotificationHelper.settingsModal = this.notificationSettingsModal;

        this.languages = this.localization.languages;
        this.currentLanguage = this.localization.currentLanguage;
        this.isImpersonatedLogin = this._sessionService.impersonatorUserId > 0;

        this.shownLoginNameTitle = this.isImpersonatedLogin ? this.l('YouCanBackToYourAccount') : '';
        this.getCurrentLoginInformations();
        this.getProfilePicture();

        this.registerToEvents();
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });

        abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
            this.unreadChatMessageCount = messageCount;
        });

        abp.event.on('app.chat.connected', () => {
            this.chatConnected = true;
        });

        abp.event.on('bookingListSelectChanged', () => {
            this._appStorageService.removeItem(AppConsts.outletSelectListCache);
        });
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
                abp.appPath
            );

            window.location.reload();
        });
    }

    getCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this._abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = result.profilePicture;
            }
        });
    }

    showLoginAttempts(): void {
        this.loginAttemptsModal.show();
    }

    changePassword(): void {
        this.changePasswordModal.show();
    }

    changeProfilePicture(): void {
        this.changeProfilePictureModal.show();
    }

    changeMySettings(): void {
        this.mySettingsModal.show();
    }

    logout(): void {
        this._authService.logout();
    }

    back(): void {
        this._location.back();
    }

    onMySettingsModalSaved(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    get chatEnabled(): boolean {
        return (!this._sessionService.tenantId || this.feature.isEnabled('App.ChatFeature'));
    }
}
