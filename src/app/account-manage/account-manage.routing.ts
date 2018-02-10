import { AccountConditionComponent } from 'app/account-manage/account-condition/account-condition.component';
import { AccountListComponent } from 'app/account-manage/mobile-account-list/account-list.component';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
                    {
                        path: 'list',
                        component: AccountListComponent,
                        data: { breadcrumb: 'Menu.Account.Manage' },
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AccountManagRoutingModule {
}
