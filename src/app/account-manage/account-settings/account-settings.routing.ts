import { RouterModule, Routes } from '@angular/router';

import { AccountSecurityComponent } from './account-settings.component';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { EmailComponent } from 'app/account-manage/account-settings/security/email/email.component';
import { LangSwitchComponent } from './lang-switch/lang-switch.component';
import { PasswdComponent } from './security/passwd/passwd.component';
import { PhoneComponent } from './security/phone/phone.component';
import { SecurityComponent } from './security/security.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
            {
                path: '',
                component: AccountSecurityComponent,
                data: { breadcrumb: 'Menu.Settings' },
            },
            {
                path: 'security',
                component: SecurityComponent,
                data: { breadcrumb: 'Menu.Security' },
            },
            {
                path: 'passwd',
                component: PasswdComponent,
                data: { breadcrumb: 'Page.ChangePassword' },
            },
            {
                path: 'phone',
                component: PhoneComponent,
                data: { breadcrumb: 'Page.BindingPhone' },
            },
            {
                path: 'email',
                component: EmailComponent,
                data: { breadcrumb: 'Page.BindingEmail' },
            },
            {
                path: 'lang',
                component: LangSwitchComponent,
                data: { breadcrumb: 'Page.SwitchLanguage' },
            }
        ]
    }
];

export const AccountSecurityRoutes = RouterModule.forChild(routes);