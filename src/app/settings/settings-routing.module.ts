import { Router, RouterModule } from '@angular/router';

import { AdminPermissions } from '@shared/AdminPermissions';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [

                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SettingsRoutingModule {

}
