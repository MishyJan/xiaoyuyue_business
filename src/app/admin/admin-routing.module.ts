import { AdminPermissions } from '@shared/AdminPermissions';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { BookingListComponent } from './manage-booking/booking-list/booking-list.component';
import { CreateOrEditBookingComponent } from './manage-booking/create-or-edit-booking/create-or-edit-booking.component';
import { OutletListComponent } from './manage-org/outlet-list/outlet-list.component';
import { OrgInfoComponent } from './manage-org/org-info/org-info.component';
import { CreateOrEditOutletComponent } from './manage-org/create-or-edit-outlet/create-or-edit-outlet.component';
import { CustomerListComponent } from './manage-customer/customer-list/customer-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: 'booking',
                        children: [
                            { path: '', redirectTo: 'list' },
                            { path: "list", component: BookingListComponent },
                            { path: "create", component: CreateOrEditBookingComponent },
                            { path: "edit/:id", component: CreateOrEditBookingComponent }
                        ]
                    },
                    {
                        path: 'org',
                        children: [
                            { path: '', redirectTo: 'list' },
                            { path: "list", component: OutletListComponent },
                            { path: "info", component: OrgInfoComponent },
                            { path: "create", component: CreateOrEditOutletComponent },
                            { path: "edit/:id", component: CreateOrEditOutletComponent }
                        ]
                    },
                    {
                        path: 'custom',
                        children: [
                            { path: '', redirectTo: 'list' },
                            { path: "list", component: CustomerListComponent },
                        ]
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {
    constructor(private router: Router) {
        router.events.subscribe(() => {
            this.hideOpenJTableDropdownMenus();
        });
    }

    hideOpenJTableDropdownMenus(): void {
        var $dropdownMenus = $('.dropdown-menu.tether-element');
        $dropdownMenus.css({
            'display': 'none'
        });
    }
}