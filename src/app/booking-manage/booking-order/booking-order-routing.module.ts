import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { BookingOrderListComponent } from 'app/booking-manage/booking-order/booking-order-list.component';
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
                    { path: 'list', component: BookingOrderListComponent, data: { title: 'Menu.ManageBooking.Orders', permission: Permissions.bookingManage_BookingOrders } },
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
