import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountConditionComponent } from 'app/account-manage/account-condition/account-condition.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: '',
                        component: AccountConditionComponent,
                        data: { breadcrumb: '账户概况' }
                    },
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AccountConditionRoutingModule {
}
