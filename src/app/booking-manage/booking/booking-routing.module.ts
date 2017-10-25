import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { BookingDetailComponent } from './list/booking-detail/booking-detail.component';
import { BookingListComponent } from './list/booking-list.component';
import { CreateOrEditBookingComponent } from './create-or-edit/create-or-edit-booking.component';
import { CreateSucceededComponent } from './create-or-edit/create-succeeded/create-succeeded.component';
import { NgModule } from '@angular/core';
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
                    { path: 'list', component: BookingListComponent, data: { breadcrumb: 'Menu.ManageBooking.List', permission: Permissions.bookingManage } },
                    { path: 'create', component: CreateOrEditBookingComponent, data: { breadcrumb: 'Booking.Create', permission: Permissions.bookingManage_BookingCreate } },
                    { path: 'edit/:id', component: CreateOrEditBookingComponent, data: { breadcrumb: 'Booking.Edit', permission: Permissions.bookingManage_BookingEdit } },
                    { path: 'succeed/:id', component: CreateSucceededComponent, data: { breadcrumb: 'AddSuccess' } },
                    { path: 'detail/:id', component: BookingDetailComponent, data: { breadcrumb: 'Booking.Detail' } },
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
