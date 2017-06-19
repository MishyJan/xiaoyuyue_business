import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { LocalizationService } from '@abp/localization/localization.service';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { ProfileServiceProxy,UserLinkServiceProxy,UserServiceProxy,LinkedUserDto,ChangeUserLanguageDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

import { AppConsts } from '@shared/AppConsts';
import { NotificationSettingsModalCompoent } from "app/shared/layout/notifications/notification-settings-modal.component";
// import { AppAuthService } from "app/shared/common/auth/app-auth.service";
import { LinkedAccountService } from "app/shared/layout/linked-account.service";
import { UserNotificationHelper } from "app/shared/layout/notifications/UserNotificationHelper";

@Component({
    templateUrl: './header.component.html',
    selector: 'xiaoyuyue-header',
    styleUrls: [
        './header.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends AppComponentBase implements OnInit {

    @ViewChild('notificationSettingsModal') notificationSettingsModal: NotificationSettingsModalCompoent;

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin: boolean = false;

    shownLoginNameTitle: string = "";
    shownLoginName: string = "";
    profilePicture: string = "/assets/common/images/default-profile-picture.png";
    recentlyLinkedUsers: LinkedUserDto[];
    unreadChatMessageCount = 0;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    chatConnected = false;

    constructor(
        injector: Injector,
        private _sessionService: AbpSessionService,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _profileServiceProxy: ProfileServiceProxy,
        private _userLinkServiceProxy: UserLinkServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        // private _authService: AppAuthService,
        private _linkedAccountService: LinkedAccountService,
        private _userNotificationHelper: UserNotificationHelper
    ) {
        super(injector);
    }

    ngOnInit() {
        this._userNotificationHelper.settingsModal = this.notificationSettingsModal;

        this.languages = this.localization.languages;
        this.currentLanguage = this.localization.currentLanguage;
        this.isImpersonatedLogin = this._sessionService.impersonatorUserId > 0;

        this.shownLoginNameTitle = this.isImpersonatedLogin ? this.l("YouCanBackToYourAccount") : "";
        this.getCurrentLoginInformations();
        this.getProfilePicture();
        this.getRecentlyLinkedUsers();

        this.registerToEvents();
    }

    registerToEvents() {
        abp.event.on("profilePictureChanged", () => {
            this.getProfilePicture();
        });

        abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
            this.unreadChatMessageCount = messageCount;
        });

        abp.event.on('app.chat.connected', () => {
            this.chatConnected = true;
        });
    }

    changeLanguage(languageName: string): void {
        let input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                "Abp.Localization.CultureName",
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
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

        return (linkedUser.tenantId ? linkedUser.tenancyName : ".") + "\\" + linkedUser.username;
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getRecentlyLinkedUsers(): void {
        this._userLinkServiceProxy.getRecentlyUsedLinkedUsers().subscribe(result => {
            this.recentlyLinkedUsers = result.items;
        });
    }

    logout(): void {
        // this._authService.logout();
    }

    onMySettingsModalSaved(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    switchToLinkedUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    get chatEnabled(): boolean {
        return (!this._sessionService.tenantId || this.feature.isEnabled("App.ChatFeature"));
    }
}