import { Component, Injector, OnInit } from '@angular/core';
import { SideBarMenu, SideBarMenuItem } from '../side-bar-menu';

import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { SidebarService } from 'shared/services/side-bar.service';

@Component({
    selector: 'xiaoyuyue-mobile-side-bar',
    templateUrl: './mobile-side-bar.component.html',
    styleUrls: ['./mobile-side-bar.component.scss']
})
export class MobileSideBarComponent extends AppComponentBase implements OnInit {
    toggleSidebarFlag: boolean = false;
    mobileMenu: SideBarMenu = new SideBarMenu('Menu', 'Menu', [
        new SideBarMenuItem(this.l('Mobile.Menu.Dashboard'), this.permissions.Dashboard, 'vapps-icon-app-org-center-menu', '/dashboard'),
        new SideBarMenuItem(this.l('Mobile.Menu.BookingManage_Bookings'), this.permissions.bookingManage_Bookings, 'vapps-icon-app-booking-menu', '/booking/list'),
        new SideBarMenuItem(this.l('Mobile.Menu.Organization_BaseInfo'), this.permissions.organization_BaseInfo, 'vapps-icon-app-org-info-menu', '/organization/info'),
        new SideBarMenuItem(this.l('Mobile.Menu.Organization_Outlets'), this.permissions.organization_Outlets, 'vapps-icon-app-outlet-menu', '/outlet/list')
    ]);
    constructor(
        private injector: Injector,
        private _authService: AppAuthService,
        private _sidebarService: SidebarService
    ) {
        super(injector);
        this._sidebarService
            .toggleSidebarFlag.subscribe(flag => {
                this.toggleSidebarFlag = flag
            })
    }

    ngOnInit() {
    }

    hide(): void {
        this.toggleSidebarFlag = false;
        this._sidebarService.toggleSidebarFlag.emit(false);
    }

    show(): void {
        this.toggleSidebarFlag = true;
    }


    showMenuItem(menuItem: SideBarMenuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName);
        }
        return true;
    }

    toOfficialSite(): void {
        window.location.href = AppConsts.shareBaseUrl;
    }

    logout(): void {
        this._authService.logout();
    }
}
