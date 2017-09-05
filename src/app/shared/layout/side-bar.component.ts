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

    desktopMenu: SideBarMenu = new SideBarMenu('MainMenu', 'MainMenu', [
        new SideBarMenuItem('BusinessCenter.Menu.UserData', this.adminPermissions.tenantDashboard, 'vapps-icon-dc-menu menu-item', '/dashboard'),
        new SideBarMenuItem('BusinessCenter.Menu.ManageBooking', this.adminPermissions.userManage, 'vapps-icon-bm-menu menu-item', '', [
            new SideBarMenuItem('BusinessCenter.Menu.ManageBooking.List', '', '', '/booking/list'),
            new SideBarMenuItem('应约人列表', '', '', '/customer/list'),
        ]),
        new SideBarMenuItem('BusinessCenter.Menu.OrgInfo', this.adminPermissions.configuration, 'vapps-icon-oi-menu menu-item', '', [
            new SideBarMenuItem('BusinessCenter.Menu.Org.BaseInfo', '', '', '/organization/info'),
            new SideBarMenuItem('BusinessCenter.Menu.Org.TenantManage', '', '', '/outlet/list'),
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
