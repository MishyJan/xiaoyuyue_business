import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { CreateOrEditOutletComponent } from './create-or-edit-outlet/create-or-edit-outlet.component';
import { NgModule } from '@angular/core';
import { OutletListComponent } from './outlet-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    { path: '', redirectTo: 'list' },
                    { path: 'list', component: OutletListComponent },
                    { path: 'create', component: CreateOrEditOutletComponent },
                    { path: 'edit/:id', component: CreateOrEditOutletComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class OutletRoutingModule {

}
