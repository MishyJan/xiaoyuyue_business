import { AuthComponent } from './auth.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ExternalLoginGuard } from 'app/shared/common/auth/external-login-guard';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { RouterModule } from '@angular/router';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AuthComponent,
                children: [
                    { path: 'login', component: LoginComponent, data: { title: 'LogIn' } },
                    { path: 'register', component: RegisterComponent, data: { title: 'Register' } },
                    { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: 'ForgotPassword' } },
                    { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'ResetPassword' } },
                    { path: 'email-activation', component: EmailActivationComponent, data: { title: 'EmailActivation' } },
                    { path: 'confirm-email', component: ConfirmEmailComponent, data: { title: 'ConfirmEmail' } },
                    { path: 'send-code', component: SendTwoFactorCodeComponent, data: { title: 'SendCode' } },
                    { path: 'verify-code', component: ValidateTwoFactorCodeComponent, data: { title: 'VerifyCode' } }
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
export class AuthRoutingModule { }