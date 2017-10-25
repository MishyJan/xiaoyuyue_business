import { AppConsts } from 'shared/AppConsts';
import { AuthComponent } from './auth.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ExternalAuthComponent } from 'app/auth/external-auth/external-auth.component';
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
import { SupplyRegisterComponent } from './supply-register/supply-register.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AuthComponent,
                children: [
                    { path: 'login', component: LoginComponent, data: { breadcrumb: 'Page.Login' } },
                    { path: 'external', component: ExternalAuthComponent, data: { breadcrumb: 'Page.External' } },
                    { path: 'register', component: RegisterComponent, data: { breadcrumb: 'Page.Register' } },
                    { path: 'supply-register', component: SupplyRegisterComponent, data: { breadcrumb: 'Page.SupplyRegister' } },
                    { path: 'forgot-password', component: ForgotPasswordComponent, data: { breadcrumb: 'Page.ForgotPassword' } },
                    { path: 'reset-password', component: ResetPasswordComponent, data: { breadcrumb: 'Page.ResetPassword' } },
                    { path: 'email-activation', component: EmailActivationComponent, data: { breadcrumb: 'Page.EmailActivation' } },
                    { path: 'confirm-email', component: ConfirmEmailComponent, data: { breadcrumb: 'Page.ConfirmEmail' } },
                    { path: 'send-code', component: SendTwoFactorCodeComponent, data: { breadcrumb: 'Page.SendCode' } },
                    { path: 'verify-code', component: ValidateTwoFactorCodeComponent, data: { breadcrumb: 'Page.VerifyCode' } }
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