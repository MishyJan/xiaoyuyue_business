import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { ModalModule } from 'ngx-bootstrap';
import { ResponsiveModule } from 'ng2-responsive';
import { AccountSecurityRoutes } from './account-settings.routing';
import { AccountSecurityComponent } from './account-settings.component';
import { SecurityComponent } from './security/security.component';
import { PasswdComponent } from './security/passwd/passwd.component';

@NgModule({
    imports: [
        AccountSecurityRoutes,
        AppCommonModule,
        FormsModule,
        ModalModule.forRoot(),
        ResponsiveModule
    ],
    declarations: [
        AccountSecurityComponent,
        ChangePasswdModelComponent,
        PasswdComponent
,
    SecurityComponent
]
})
export class AccountSecurityModule { }