import { AccountSecurityComponent } from 'app/account-security/account-security.component';
import { AccountSecurityRoutes } from './account-security.routing';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        AccountSecurityRoutes,
        AppCommonModule,
        FormsModule,
        ModalModule.forRoot(),
    ],
    declarations: [
        AccountSecurityComponent,
        ChangePasswdModelComponent
    ]
})
export class AccountSecurityModule { }