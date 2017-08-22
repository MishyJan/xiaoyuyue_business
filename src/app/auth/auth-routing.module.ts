import { AppRouteGuard } from "app/shared/common/auth/auth-route-guard";
import { AuthComponent } from './auth.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ExternalLoginGuard } from "app/shared/common/auth/external-login-guard";
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
                    { path: 'login', component: LoginComponent},
                    { path: 'register', component: RegisterComponent },
                    { path: 'forgot-password', component: ForgotPasswordComponent },
                    { path: 'reset-password', component: ResetPasswordComponent },
                    { path: 'email-activation', component: EmailActivationComponent },
                    { path: 'confirm-email', component: ConfirmEmailComponent },
                    { path: 'send-code', component: SendTwoFactorCodeComponent },
                    { path: 'verify-code', component: ValidateTwoFactorCodeComponent }
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