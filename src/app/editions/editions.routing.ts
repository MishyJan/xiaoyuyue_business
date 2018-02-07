import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { AccountConditionComponent } from 'app/account-manage/account-condition/account-condition.component';
import { EditionsListComponent } from 'app/editions/list/editions-list.component';
import { ToPayMobileComponent } from 'app/editions/list/to-pay-mobile/to-pay-mobile.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: '', redirectTo: '/editions/list', pathMatch: 'full' },
                    {
                        path: 'list',
                        component: EditionsListComponent,
                        data: { breadcrumb: '账户版本' }
                    },
                    {
                        path: 'pays',
                        component: ToPayMobileComponent,
                        data: { breadcrumb: '开通会员' }
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class EditionsRoutingModule {
}
