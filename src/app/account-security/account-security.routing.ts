import { RouterModule, Routes } from '@angular/router';

import { AccountSecurityComponent } from 'app/account-security/account-security.component';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';

const routes: Routes = [
    {
        path: '',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        component: AccountSecurityComponent,
        data: { breadcrumb: '账户安全' },
        children: [
        ]
    }
];

export const AccountSecurityRoutes = RouterModule.forChild(routes);