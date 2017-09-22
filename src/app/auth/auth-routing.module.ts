import { AppConsts } from "shared/AppConsts";
import { AuthComponent } from './auth.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ExternalLoginGuard } from 'app/shared/common/auth/external-login-guard';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { LocalizationService } from '@abp/localization/localization.service';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { RouterModule } from '@angular/router';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';
import { SupplyRegisterComponent } from './supply-register/supply-register.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AuthComponent,
                children: [
                    { path: 'login', component: LoginComponent, data: { breadcrumb: 'LogIn' } },
                    { path: 'register', component: RegisterComponent, data: { breadcrumb: 'Register' } },
                    { path: 'supply-register', component: SupplyRegisterComponent, data: { breadcrumb: '补充注册' } },
                    { path: 'forgot-password', component: ForgotPasswordComponent, data: { breadcrumb: 'ForgotPassword' } },
                    { path: 'reset-password', component: ResetPasswordComponent, data: { breadcrumb: 'ResetPassword' } },
                    { path: 'email-activation', component: EmailActivationComponent, data: { breadcrumb: 'EmailActivation' } },
                    { path: 'confirm-email', component: ConfirmEmailComponent, data: { breadcrumb: 'ConfirmEmail' } },
                    { path: 'send-code', component: SendTwoFactorCodeComponent, data: { breadcrumb: 'SendCode' } },
                    { path: 'verify-code', component: ValidateTwoFactorCodeComponent, data: { breadcrumb: 'VerifyCode' } }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        ExternalLoginGuard
    ]
})

export class AuthRoutingModule {

    constructor(private localization: LocalizationService) {

    }

    public l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, AppConsts.localization.defaultLocalizationSourceName);

        if (localizedText === key) {
            localizedText = this.localization.localize(key, AppConsts.localization.commonLocalizationSourceName);
        }

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }
}