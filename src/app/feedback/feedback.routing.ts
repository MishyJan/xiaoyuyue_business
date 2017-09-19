import { RouterModule, Routes } from '@angular/router';

import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { FeedbackComponent } from './feedback.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        component: FeedbackComponent,
        data: { breadcrumb: '意见反馈' },
        children: [
        ]
    }
];

export const FeedbackRoutes = RouterModule.forChild(routes);
