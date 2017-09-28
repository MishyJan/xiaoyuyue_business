import { RouterModule, Routes } from '@angular/router';

import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { AccountSecurityComponent } from './account-settings.component';
import { SecurityComponent } from './security/security.component';
import { PasswdComponent } from './security/passwd/passwd.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
            {
                path:'',
                component: AccountSecurityComponent,
                data: { breadcrumb: '账户设置' },
            },
            {
                path: 'security',
                component: SecurityComponent,
                data: { breadcrumb: '账户安全' },
            },
            {
                path: 'passwd',
                component: PasswdComponent,
                data: { breadcrumb: '更换密码' },
            }
        ]
    }
];

export const AccountSecurityRoutes = RouterModule.forChild(routes);