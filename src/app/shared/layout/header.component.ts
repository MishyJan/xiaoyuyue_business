import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChangeUserLanguageDto, CurrentUserProfileEditDto, LinkedUserDto, ProfileServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { Params, Router } from '@angular/router';

import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { Breadcrumb } from 'shared/services/bread-crumb.service';
import { ClientTypeHelper } from 'shared/helpers/ClientTypeHelper';
import { CookiesService } from './../../../shared/services/cookies.service';
import { LocalStorageService } from 'shared/utils/local-storage.service';
import { LocalizationService } from '@abp/localization/localization.service';
import { Location } from '@angular/common';
import { MobileSideBarComponent } from './mobile-side-bar/mobile-side-bar.component';
import { NotificationSettingsModalCompoent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { SidebarService } from 'shared/services/side-bar.service';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';

@Component({
    templateUrl: './header.component.html',
    selector: 'header',
    styleUrls: [
        './header.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends AppComponentBase implements OnInit, AfterViewInit {
    canLimitCreateBooking: boolean;
    isResetHeaderStyleFlag: any;
    isDashboardFlag: boolean;

    @ViewChild('notificationSettingsModal') notificationSettingsModal: NotificationSettingsModalCompoent;

    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin = false;
    title: string;
    shownLoginNameTitle = '';
    shownLoginName = '';
    profilePicture = '/assets/common/images/default-profile-picture.png';
    recentlyLinkedUsers: LinkedUserDto[];
    unreadChatMessageCount = 0;

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    chatConnected = false;
    iswxjsEnvironment = false;
    constructor(
        injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _authService: AppAuthService,
        private _userNotificationHelper: UserNotificationHelper,
        private _localStorageService: LocalStorageService,
        private _location: Location,
        private _cookiesService: CookiesService,
        private _sidebarService: SidebarService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.canLimitCreateBooking = this.appSession.canLimitCreateBooking()
        this.iswxjsEnvironment = ClientTypeHelper.isWeChatMiniProgram;
        this.breadcrumbService.breadcrumbChanged.subscribe((crumbs) => {
            this.title = this.createHearderTitle(this.breadcrumbService.breadcrumbs);
        });
        this.title = this.createHearderTitle(this.breadcrumbService.breadcrumbs);

        this._userNotificationHelper.settingsModal = this.notificationSettingsModal;

        this.languages = this.localization.languages;
        this.currentLanguage = this.localization.currentLanguage;
        this.isImpersonatedLogin = this.appSession.impersonatorUserId > 0;

        this.shownLoginNameTitle = this.isImpersonatedLogin ? this.l('YouCanBackToYourAccount') : '';

        this.registerToEvents();
    }

    ngAfterViewInit() {
        this.getCurrentLoginInformations();
        this.getProfilePicture();
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });

        abp.event.on('userNameChanged', () => {
            this.getCurrentLoginInformations();
        });

        abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
            this.unreadChatMessageCount = messageCount;
        });

        abp.event.on('app.chat.connected', () => {
            this.chatConnected = true;
        });

        abp.event.on('outletListSelectChanged', () => {
            this._localStorageService.removeItem(abp.utils.formatString(AppConsts.outletSelectListCache, this.appSession.tenantId));
        });
        abp.event.on('contactorListSelectChanged', () => {
            this._localStorageService.removeItem(abp.utils.formatString(AppConsts.contactorSelectListCache, this.appSession.tenantId));
        });

        abp.event.on('bookingListSelectChanged', () => {
            this._localStorageService.removeItem(abp.utils.formatString(AppConsts.bookingSelectListCache, this.appSession.tenantId));
        });
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._profileServiceProxy.changeLanguage(input).subscribe(() => {
            this._cookiesService.setCookieValue(
                'Abp.Localization.CultureName',
                languageName,
                new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
                abp.appPath
            );

            window.location.reload();
        });
    }

    getCurrentLoginInformations(): void {
        if (this.isMobile($('.mobile-header'))) { return; }

        this._profileServiceProxy
            .getCurrentUserProfileForEdit()
            .subscribe((result: CurrentUserProfileEditDto) => {
                this.shownLoginName = result.userName;
            })
    }

    getShownUserName(linkedUser: LinkedUserDto): string {
        if (!this.multiTenancy.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    }

    getProfilePicture(): void {
        if (this.isMobile($('.mobile-header'))) { return; }

        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = result.profilePicture;
            }
        });
    }

    logout(): void {
        this._authService.logout();
    }

    back(): void {
        this._location.back();
    }

    showSidebar(): void {
        this._sidebarService.toggleSidebarFlag.emit(true);
    }

    onMySettingsModalSaved(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
    }

    get chatEnabled(): boolean {
        return (!this.appSession.tenantId || this.feature.isEnabled('App.ChatFeature'));
    }

    createHearderTitle(routesCollection: Breadcrumb[]): string {

        const titles = routesCollection.filter((route) => route.displayName);

        return this.hearderTitlesToString(titles);
    }

    hearderTitlesToString(titles) {
        return titles.reduce((prev, curr) => {
            // return `${this.l(curr.displayName)} - ${prev}`;
            return `${this.l(curr.displayName)}`;
        }, '');
    }

}
