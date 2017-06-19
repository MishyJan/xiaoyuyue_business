import * as ngCommon from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AbpModule } from '@abp/abp.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { AppConsts } from '@shared/AppConsts';
import { UtilsModule } from '@shared/utils/utils.module';
import { CommonModule } from '@shared/common/common.module';
import { TenantChangeComponent } from './shared/tenant-change.component';
import { TenantChangeModalComponent } from './shared/tenant-change-modal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { TenantRegistrationHelperService } from './register/tenant-registration-helper.service';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { LanguageSwitchComponent } from './language-switch.component';
import { LoginService } from "shared/services/login.service";
import { TooltipModule } from "ngx-bootstrap";
import { SMSServiceProxy } from "shared/service-proxies/service-proxies";
import { AuthComponent } from "auth/auth.component";
import { AuthRoutingModule } from "auth/auth-routing.module";
import { PhoneValidateComponent } from "auth/shared/phone-validate/phone-validate.component";
import { LuosimaoCaptcha } from "auth/shared/luosimao-captcha/luosimao-captcha.component";
import { HeaderComponent } from "auth/layout/header/header.component";
import { FooterComponent } from "auth/layout/footer/footer.component";
import { BackgroundImgComponent } from "auth/layout/background-img/background-img.component";

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,

        ModalModule.forRoot(),
        TooltipModule.forRoot(),

        AbpModule,

        CommonModule,

        UtilsModule,
        ServiceProxyModule,
        AuthRoutingModule
    ],
    declarations: [
        AuthComponent,
        TenantChangeComponent,
        TenantChangeModalComponent,
        LoginComponent,
        RegisterComponent,
        RegisterTenantComponent,
        RegisterTenantResultComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        EmailActivationComponent,
        ConfirmEmailComponent,
        SendTwoFactorCodeComponent,
        ValidateTwoFactorCodeComponent,
        LanguageSwitchComponent,
        PhoneValidateComponent,
        LuosimaoCaptcha,
        
        HeaderComponent,
        FooterComponent,
        BackgroundImgComponent
    ],
    providers: [
        LoginService,
        TenantRegistrationHelperService,
        SMSServiceProxy,
        TooltipModule
    ]
})
export class AuthModule {

}