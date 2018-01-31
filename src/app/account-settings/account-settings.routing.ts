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
                data: { breadcrumb: 'Menu.ChangePassword' },
            },
            {
                path: 'phone',
                component: PhoneComponent,
                data: { breadcrumb: 'Menu.ChangeAndBindingPassword' },
            },
            {
                path: 'email',
                component: EmailComponent,
                data: { breadcrumb: 'Menu.ChangeAndBindingEmail' },
            },
            {
                path: 'lang',
                component: LangSwitchComponent,
                data: { breadcrumb: 'Menu.SwitchLanguage' },
            }
        ]
    }
];

export const AccountSecurityRoutes = RouterModule.forChild(routes);