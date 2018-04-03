import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { AccountConditionComponent } from 'app/account-manage/account-condition/account-condition.component';
import { EditionsListComponent } from 'app/editions/list/editions-list.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                children: [
                    { path: '', redirectTo: '/editions/list', pathMatch: 'full' },
                    {
                        path: 'list',
                        component: EditionsListComponent,
                        data: { breadcrumb: '账户版本' }
                    }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class EditionsRoutingModule {
}
