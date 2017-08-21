import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { BookingListComponent } from './list/booking-list.component';
import { CreateOrEditBookingComponent } from './create-or-edit/create-or-edit-booking.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: '', redirectTo: 'list' },
                    { path: 'list', component: BookingListComponent },
                    { path: 'create', component: CreateOrEditBookingComponent },
                    { path: 'edit/:id', component: CreateOrEditBookingComponent }
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
