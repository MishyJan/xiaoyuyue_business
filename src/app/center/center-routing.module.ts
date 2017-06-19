import { AdminPermissions } from '@shared/AdminPermissions';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CenterComponent } from "app/center/center.component";
import { BookingManageComponent } from "app/center/booking-manage/booking-manage.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CenterComponent,
                children: [
                    {
                        path: 'manage', component: BookingManageComponent
                    },
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