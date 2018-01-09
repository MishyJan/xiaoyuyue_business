import { RouterModule, Routes } from '@angular/router';

import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { AccountSecurityComponent } from './account-settings.component';
import { SecurityComponent } from './security/security.component';
import { PasswdComponent } from './security/passwd/passwd.component';
import { PhoneComponent } from './security/phone/phone.component';
import { LangSwitchComponent } from './lang-switch/lang-switch.component';
import { EmailComponent } from 'app/account-settings/security/email/email.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
            {
                path: '',
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
            },
            {
                path: 'phone',
                component: PhoneComponent,
                data: { breadcrumb: '更绑手机' },
            },
            {
                path: 'email',
                component: EmailComponent,
                data: { breadcrumb: '更绑邮箱' },
            },
            {
                path: 'lang',
                component: LangSwitchComponent,
                data: { breadcrumb: '语言切换' },
            }
        ]
    }
];

export const AccountSecurityRoutes = RouterModule.forChild(routes);