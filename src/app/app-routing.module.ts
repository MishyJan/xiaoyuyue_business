import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { NgModule } from '@angular/core';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'app',
                component: AppComponent,
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    {
                        path: '',
                        children: [
                            { path: 'notifications', component: NotificationsComponent },
                            { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
                        ]
                    },
                    {
                        path: 'dashboard',
                        loadChildren: 'app/dashboard/dashboard.module#DashboardModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'admin',
                        loadChildren: 'app/admin/admin.module#AdminModule', // Lazy load admin module
                        data: { preload: true }
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }