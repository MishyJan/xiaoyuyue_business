import { RouterModule, Routes } from '@angular/router';

import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { FeedbackComponent } from './feedback.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        component: FeedbackComponent,
        data: { breadcrumb: 'Menu.Account.Feedback' },
        children: [
        ]
    }
];

export const FeedbackRoutes = RouterModule.forChild(routes);
