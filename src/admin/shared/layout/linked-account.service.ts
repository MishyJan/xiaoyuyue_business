﻿import { Injectable } from '@angular/core';
import { AccountServiceProxy, SwitchToLinkedAccountInput, SwitchToLinkedAccountOutput } from '@shared/service-proxies/service-proxies';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AppAuthService } from '@admin/shared/common/auth/app-auth.service';

@Injectable()
export class LinkedAccountService {

    constructor(
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _authService: AppAuthService
    ) {

    }

    switchToAccount(userId: number, tenantId?: number): void {

        let input = new SwitchToLinkedAccountInput();
        input.targetUserId = userId;
        input.targetTenantId = tenantId;

        this._accountService.switchToLinkedAccount(input)
            .subscribe((result: SwitchToLinkedAccountOutput) => {
                this._authService.logout(false);

                var targetUrl = this._appUrlService.getAppRootUrlOfTenant(result.tenancyName) + "?switchAccountToken=" + result.switchAccountToken;
                if (input.targetTenantId) {
                    targetUrl = targetUrl + '&tenantId=' + input.targetTenantId;
                }

                location.href = targetUrl;
            });
    }
}