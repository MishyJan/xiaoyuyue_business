import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { BookingListComponent } from './list/booking-list.component';
import { CreateOrEditBookingComponent } from './create-or-edit/create-or-edit-booking.component';
import { CreateSucceededComponent } from './create-or-edit/create-succeeded/create-succeeded.component';
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
                    { path: 'list', component: BookingListComponent },
                    { path: 'create', component: CreateOrEditBookingComponent },
                    { path: 'edit/:id', component: CreateOrEditBookingComponent },
                    { path: 'succeed/:id', component: CreateSucceededComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class BookingRoutingModule {

}
