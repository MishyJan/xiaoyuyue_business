import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';

import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppTenantAvailabilityState } from 'shared/AppEnums';
import { CookiesService } from 'shared/services/cookies.service';
import { IsTenantAvailableInput } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'tenantChangeModal',
    templateUrl: './tenant-change-modal.component.html'
})
export class TenantChangeModalComponent extends AppComponentBase {

    @ViewChild('tenantChangeModal') modal: ModalDirective;
    @ViewChild('tenancyNameInput') tenancyNameInput: ElementRef;

    tenancyName = '';
    active = false;
    saving = false;

    constructor(
        private _accountService: AccountServiceProxy,
        private _cookiesService: CookiesService,
        injector: Injector
    ) {
        super(injector);
    }

    show(tenancyName: string): void {
        this.tenancyName = tenancyName;
        this.active = true;
        this.modal.show();
    }

    onShown(): void {
        $(this.tenancyNameInput.nativeElement).focus().select();
    }

    save(): void {

        if (!this.tenancyName) {
            this._cookiesService.setTenantIdCookie(undefined);
            this.close();
            location.reload();
            return;
        }

        const input = new IsTenantAvailableInput();
        input.tenancyName = this.tenancyName;

        this.saving = true;
        this._accountService.isTenantAvailable(input)
            .finally(() => { this.saving = false; })
            .subscribe((result) => {
                switch (result.state) {
                    case AppTenantAvailabilityState.Available:
                        this._cookiesService.setTenantIdCookie(result.tenantId);
                        this.close();
                        location.reload();
                        return;
                    case AppTenantAvailabilityState.InActive:
                        this.message.warn(this.l('TenantIsNotActive', this.tenancyName));
                        break;
                    case AppTenantAvailabilityState.NotFound: // NotFound
                        this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName));
                        break;
                }
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}