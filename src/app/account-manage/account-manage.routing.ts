import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { AccountConditionComponent } from 'app/account-manage/account-condition/account-condition.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: '', redirectTo: '/account/settings', pathMatch: 'full' },
                    {
                        path: 'settings',
                        loadChildren: 'app/account-manage/account-settings/account-settings.module#AccountSecurityModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'condition',
                        loadChildren: 'app/account-manage/account-condition/account-condition.module#AccountConditionModule', // Lazy load main module
                        data: { preload: true }
                    },
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AccountManagRoutingModule {
}
