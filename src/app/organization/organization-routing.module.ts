import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { CreateOrEditOutletComponent } from 'app/organization/outlet/create-or-edit-outlet/create-or-edit-outlet.component';
import { NgModule } from '@angular/core';
import { OrgInfoComponent } from 'app/organization/info/org-info.component';
import { OutletListComponent } from 'app/organization/outlet/outlet-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'org',
                children: [
                    { path: '', redirectTo: 'list' },
                    { path: 'list', component: OutletListComponent },
                    { path: 'info', component: OrgInfoComponent },
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
export class OrganizationRoutingModule {

}
