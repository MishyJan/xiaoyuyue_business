import { AccountServiceProxy, SendPasswordResetCodeInput } from '@shared/service-proxies/service-proxies';
import { Component, Injector } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    animations: [accountModuleAnimation()]
})
export class ForgotPasswordComponent extends AppComponentBase {

    model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();
    sending = false;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _router: Router
    ) {
        super(injector);
    }

    save(): void {
        this.sending = true;
        this._accountService.sendPasswordResetCode(this.model)
            .finally(() => { this.sending = false; })
            .subscribe(() => {
                this.message.success(this.l('PasswordResetMailSentMessage'), this.l('MailSent')).done(() => {
                    this._router.navigate(['auth/login']);
                });
            });
    }
}