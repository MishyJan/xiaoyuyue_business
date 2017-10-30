import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountSecurityComponent } from './account-settings.component';
import { AccountSecurityRoutes } from './account-settings.routing';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { BindingPhoneModelComponent } from './phone-model/binding-phone-model/binding-phone-model.component';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { CommonModule } from '@angular/common';
import { ExternalBindingModelComponent } from './external-auth/external-binding-model/external-binding-model.component';
import { ModalModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { PasswdComponent } from './security/passwd/passwd.component';
import { PhoneComponent } from './security/phone/phone.component';
import { QRCodeModule } from 'angular2-qrcode';
import { ResponsiveModule } from 'ng2-responsive';
import { SecurityComponent } from './security/security.component';
import { UnbindingPhoneModelComponent } from './phone-model/unbinding-phone-model/unbinding-phone-model.component';
import { UtilsModule } from 'shared/utils/utils.module';
import { LoginService } from 'shared/services/login.service';

@NgModule({
    imports: [
        CommonModule,
        AccountSecurityRoutes,
        AppCommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        ResponsiveModule,
        QRCodeModule
    ],
    declarations: [
        AccountSecurityComponent,
        ChangePasswdModelComponent,
        PasswdComponent,
        SecurityComponent,
        UnbindingPhoneModelComponent,
        BindingPhoneModelComponent,
        PhoneComponent,
        ExternalBindingModelComponent
    ],
    providers: [
        LoginService
    ]
})
export class AccountSecurityModule { }