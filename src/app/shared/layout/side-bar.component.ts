import { AdminPermissions } from '@shared/AdminPermissions';
import { Component, Injector } from '@angular/core';
import { SideBarMenu } from './side-bar-menu';
import { SideBarMenuItem } from './side-bar-menu-item';

import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss'],
    selector: 'side-bar'
})
export class SideBarComponent extends AppComponentBase {
    
    constructor(
        injector: Injector,
        public permission: PermissionCheckerService,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    menu: SideBarMenu = new SideBarMenu("MainMenu", "MainMenu", [
        new SideBarMenuItem("BusinessCenter.Menu.UserData", this.adminPermissions.tenantDashboard, "vapps-icon-dc-menu menu-item", "/app/main/dashboard"),
        new SideBarMenuItem("BusinessCenter.Menu.ManageBooking", this.adminPermissions.userManage, "vapps-icon-bm-menu menu-item", "", [
            new SideBarMenuItem("BusinessCenter.Menu.ManageBooking.List", "", "", "/app/admin/booking/list"),
            new SideBarMenuItem("应约人列表", "", "", "/app/admin/custom/list"),
        ]),
        new SideBarMenuItem("BusinessCenter.Menu.OrgInfo", this.adminPermissions.configuration, "vapps-icon-oi-menu menu-item", "", [
            new SideBarMenuItem("BusinessCenter.Menu.Org.BaseInfo", "", "", "/app/admin/org/info"),
            new SideBarMenuItem("BusinessCenter.Menu.Org.TenantManage", "", "", "/app/admin/org/list"),
        ])
        // new SideBarMenuItem("Admin.System", this.adminPermissions.system, "icon-settings", "", [
        //     new SideBarMenuItem("AuditLogs", this.adminPermissions.system_AuditLogs, "icon-lock", "/app/admin/auditLogs"),
        //     new SideBarMenuItem("Editions", this.adminPermissions.system_Editions, "icon-grid", "/app/admin/editions"),
        //     new SideBarMenuItem("Maintenance", this.adminPermissions.system_HostMaintenance, "icon-wrench", "/app/admin/maintenance"),
        // ]),
        // new SideBarMenuItem("Admin.ContentManage", this.adminPermissions.content, "fa fa-newspaper-o", "", [
        //     new SideBarMenuItem("MessageTemplate", this.adminPermissions.content_SmsTemplates, "fa fa-envelope-o", "/app/admin/message-template")
        // ])
    ]);

    checkChildMenuItemPermission(menuItem): boolean {

        for (var i = 0; i < menuItem.items.length; i++) {
            var subMenuItem = menuItem.items[i];

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
        if (menuItem.name == this._appSessionService.activeMenu)
            return true;

        if (menuItem.items) {
            for (var item of menuItem.items) {
                if (this.isMenuActive(item))
                    return true;
            }
        }

        return false;
    }
}