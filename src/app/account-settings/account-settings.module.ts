import { AppCommonModule } from '@app/shared/common/app-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { ModalModule } from 'ngx-bootstrap';
import { ResponsiveModule } from 'ng2-responsive';
import { AccountSecurityRoutes } from './account-settings.routing';
import { AccountSecurityComponent } from './account-settings.component';
import { SecurityComponent } from './security/security.component';
import { PasswdComponent } from './security/passwd/passwd.component';
import { BindingPhoneModelComponent } from './phone-model/binding-phone-model/binding-phone-model.component';
import { UnbindingPhoneModelComponent } from './phone-model/unbinding-phone-model/unbinding-phone-model.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        AccountSecurityRoutes,
        AppCommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        ResponsiveModule
    ],
    declarations: [
        AccountSecurityComponent,
        ChangePasswdModelComponent,
        PasswdComponent,
        SecurityComponent,
        UnbindingPhoneModelComponent,
        BindingPhoneModelComponent
    ]
})
export class AccountSecurityModule { }