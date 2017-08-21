import { AdminPermissions } from '@shared/AdminPermissions';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent, data: { permission: AdminPermissions.tenantDashboard } },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }