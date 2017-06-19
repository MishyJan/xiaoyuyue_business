import { AdminPermissions } from '@shared/AdminPermissions';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CenterComponent } from "app/center/center.component";
import { MainUserComponent } from "app/center/main-user/main-user.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CenterComponent,
                children: [
                    {
                        path: 'index', component: MainUserComponent
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