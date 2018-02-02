import { Component, Injector } from '@angular/core';
import { SideBarMenu, SideBarMenuItem } from './side-bar-menu';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';

@Component({
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
    selector: 'side-bar'
})
export class SideBarComponent extends AppComponentBase {

    desktopMenu: SideBarMenu = new SideBarMenu('Menu', 'Menu', [
        new SideBarMenuItem('Menu.Dashboard', this.permissions.Dashboard, 'vapps-icon-dc-menu menu-item', '/dashboard'),
        new SideBarMenuItem('Menu.ManageBooking', this.permissions.bookingManage, 'vapps-icon-bm-menu menu-item', '', [
            new SideBarMenuItem('Menu.ManageBooking.List', this.permissions.bookingManage_Bookings, '', '/booking/list'),
            new SideBarMenuItem('Menu.ManageBooking.Orders', this.permissions.bookingManage_BookingOrders, '', '/bookingorder/list'),
        ]),
        new SideBarMenuItem('Menu.Org', this.permissions.organization, 'vapps-icon-oi-menu menu-item', '', [
            new SideBarMenuItem('Menu.Org.BaseInfo', this.permissions.organization_BaseInfo, '', '/organization/info'),
            new SideBarMenuItem('Menu.Org.OutletManage', this.permissions.organization_Outlets, '', '/outlet/list'),
        ]),
        new SideBarMenuItem('PictureGallery.ImageManagement', this.permissions.organization, 'vapps-icon-gm-menu menu-item', '', [
            new SideBarMenuItem('PictureGallery', this.permissions.organization_BaseInfo, '', '/gallery-manage/list'),
        ]),
        new SideBarMenuItem('账户管理', this.permissions.organization, 'vapps-icon-app-account-manage-menu menu-item', '', [
            new SideBarMenuItem('账户安全', this.permissions.organization_BaseInfo, '', '/account/settings'),
            new SideBarMenuItem('账户概况', this.permissions.organization_BaseInfo, '', '/account/condition'),
            new SideBarMenuItem('账户版本', this.permissions.organization_BaseInfo, '', '/account/edition')
        ])
    ]);

    constructor(
        injector: Injector,
        public permission: PermissionCheckerService,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            const subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this.permission.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName);
        }

        if (menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return true;
    }

    isMenuActive(menuItem: SideBarMenuItem): boolean {
        if (menuItem.name === this._appSessionService.activeMenu) {
            return true;
        }
        if (menuItem.items) {
            for (const item of menuItem.items) {
                if (this.isMenuActive(item)) {
                    return true;
                }
            }
        }

        return false;
    }
}
