import * as ngCommon from '@angular/common';

import { HttpModule, JsonpModule } from '@angular/http';

import { AbpModule } from '@abp/abp.module';
import { AppCommonModule } from 'app/shared/common/app-common.module';
import { AppConsts } from '@shared/AppConsts';
import { AuthComponent } from 'app/auth/auth.component';
import { AuthRoutingModule } from 'app/auth/auth-routing.module';
import { BackgroundImgComponent } from 'app/auth/layout/background-img/background-img.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@shared/common/common.module';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ExternalAuthComponent } from 'app/auth/external-auth/external-auth.component';
import { FooterComponent } from 'app/auth/layout/footer/footer.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './layout/header/header.component';
import { LanguageSwitchComponent } from './language-switch.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from 'shared/services/login.service';
import { LuosimaoCaptcha } from 'app/auth/shared/luosimao-captcha/luosimao-captcha.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { ProtocolModelComponent } from './register/protocol-model/protocol-model.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { ResponsiveModule } from 'ng2-responsive';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { SupplyRegisterComponent } from './supply-register/supply-register.component';
import { TenantChangeComponent } from './shared/tenant-change.component';
import { TenantChangeModalComponent } from './shared/tenant-change-modal.component';
import { TenantRegistrationHelperService } from './register/tenant-registration-helper.service';
import { TooltipModule } from 'ngx-bootstrap';
import { UtilsModule } from '@shared/utils/utils.module';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        AppCommonModule.forRoot(),
        AbpModule,
        CommonModule,
        UtilsModule,
        AuthRoutingModule,
        ResponsiveModule
    ],
    declarations: [
        AuthComponent,

        TenantChangeComponent,
        TenantChangeModalComponent,
        LoginComponent,
        ExternalAuthComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponent,
        LanguageSwitchComponent,
        LuosimaoCaptcha,
        HeaderComponent,
        FooterComponent,
        BackgroundImgComponent,
        SupplyRegisterComponent,
        ProtocolModelComponent
    ],
    providers: [
        LoginService,
        TenantRegistrationHelperService,
    ]
})
export class AuthModule {

}