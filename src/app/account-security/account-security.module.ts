import { AccountSecurityComponent } from 'app/account-security/account-security.component';
import { AccountSecurityRoutes } from './account-security.routing';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        AccountSecurityRoutes,
        AppCommonModule,
        FormsModule
    ],
    declarations: [
        AccountSecurityComponent
    ]
})
export class AccountSecurityModule { }