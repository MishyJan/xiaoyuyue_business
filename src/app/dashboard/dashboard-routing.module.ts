import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { Permissions } from '@shared/Permissions';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: 'Menu.Dashboard', permission: Permissions.Dashboard },
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                component: DashboardComponent,
                children: [
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }