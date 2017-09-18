import { Component, Injector, OnInit } from '@angular/core';
import { SideBarMenu, SideBarMenuItem } from '../side-bar-menu';

import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-mobile-side-bar',
    templateUrl: './mobile-side-bar.component.html',
    styleUrls: ['./mobile-side-bar.component.scss']
})
export class MobileSideBarComponent extends AppComponentBase implements OnInit {
    toggleSidebarFlag: boolean = false;
    mobileMenu: SideBarMenu = new SideBarMenu('Menu', 'Menu', [
        new SideBarMenuItem('机构中心', this.permissions.Dashboard, '', '/dashboard'),
        new SideBarMenuItem('预约管理', this.permissions.bookingManage_Bookings, '', '/booking/list'),
        new SideBarMenuItem('机构信息', this.permissions.organization_BaseInfo, '', '/organization/info'),
        new SideBarMenuItem('门店管理', this.permissions.organization_Outlets, '', '/outlet/list')
    ]);
    constructor(
        private injector: Injector,
        private _authService: AppAuthService
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    hide(): void {
        this.toggleSidebarFlag = false;
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
