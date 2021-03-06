import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { NgModule } from '@angular/core';
import { OrgInfoComponent } from './org-info.component';
import { Permissions } from '@shared/Permissions';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    { path: '', redirectTo: 'list' },
                    { path: 'info', component: OrgInfoComponent, data: { breadcrumb: 'Menu.Org.BaseInfo', permission: Permissions.organization_BaseInfo } },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OrganizationRoutingModule {

}
