import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { NgModule } from '@angular/core';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

                    { path: 'notifications', component: NotificationsComponent },
                    {
                        path: 'dashboard',
                        loadChildren: 'app/dashboard/dashboard.module#DashboardModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'booking',
                        loadChildren: 'app/booking-manage/booking/booking.module#BookingModule', // Lazy load admin module
                        data: { preload: true }
                    },
                    {
                        path: 'customer',
                        loadChildren: 'app/booking-manage/customer/customer.module#CustomerModule', // Lazy load admin module
                        data: { preload: true }
                    },
                    {
                        path: 'organization',
                        loadChildren: 'app/organization-manage/org-info/organization.modules#OrganizationModule', // Lazy load admin module
                        data: { preload: true }
                    },
                    {
                        path: 'outlet',
                        loadChildren: 'app/organization-manage/outlet/outlet.modules#OutletModule', // Lazy load admin module
                        data: { preload: true }
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }