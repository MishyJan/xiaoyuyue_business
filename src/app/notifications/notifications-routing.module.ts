import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: NotificationsComponent,
                children: [
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class NotificationsRoutingModule { }