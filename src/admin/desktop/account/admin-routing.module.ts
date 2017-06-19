import { AdminPermissions } from '@shared/AdminPermissions';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ManageBookingComponent } from "admin/desktop/account/manage-booking/manage-booking.component";
import { CreateOrEditBookingComponent } from "admin/desktop/account/create-or-edit-booking/create-or-edit-booking.component";
import { HostSettingsComponent } from "admin/desktop/account/settings/host-settings.component";
import { TenantSettingsComponent } from "admin/desktop/account/settings/tenant-settings.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [

                    {
                        path: 'booking',
                        children: [
                            { path: '', redirectTo: 'list' },
                            { path: "list", component: ManageBookingComponent },
                            { path: "create", component: CreateOrEditBookingComponent },
                            { path: "edit/:id", component: CreateOrEditBookingComponent }
                        ]
                    },
                    { path: 'hostSettings', component: HostSettingsComponent, data: { permission: AdminPermissions.configuration_HostSettings } },
                    { path: 'tenantSettings', component: TenantSettingsComponent, data: { permission: AdminPermissions.configuration_TenantSettings } },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {
    constructor(private router: Router) {
        router.events.subscribe(() => {
            this.hideOpenJTableDropdownMenus();
        });
    }

    hideOpenJTableDropdownMenus(): void {
        var $dropdownMenus = $('.dropdown-menu.tether-element');
        $dropdownMenus.css({
            'display': 'none'
        });
    }
}