import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { CreateOrEditOutletComponent } from './create-or-edit-outlet/create-or-edit-outlet.component';
import { NgModule } from '@angular/core';
import { OutletListComponent } from './outlet-list.component';
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
                    { path: 'list', component: OutletListComponent, data: { breadcrumb: 'Menu.Org.OutletManage', permission: Permissions.organization_Outlets } },
                    { path: 'create', component: CreateOrEditOutletComponent, data: { breadcrumb: 'Outlet.Create', permission: Permissions.organization_OutletCreate } },
                    { path: 'edit/:id', component: CreateOrEditOutletComponent, data: { breadcrumb: 'Outlet.Edit', permission: Permissions.organization_OutletEdit } }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OutletRoutingModule {

}
