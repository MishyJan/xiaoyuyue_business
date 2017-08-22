import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { CustomerListComponent } from 'app/booking-manage/customer/customer-list.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    { path: '', redirectTo: 'list' },
                    { path: 'list', component: CustomerListComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CustomerRoutingModule {

}
