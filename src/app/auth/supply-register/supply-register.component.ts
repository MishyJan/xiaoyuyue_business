import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SupplementAuthModel, SupplementAuthResultModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { AppAuthService } from 'app/shared/common/auth/app-auth.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { LoginService } from 'shared/services/login.service';
import { ProtocolModelComponent } from 'app/auth/register/protocol-model/protocol-model.component';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-supply-register',
    templateUrl: './supply-register.component.html',
    styleUrls: ['./supply-register.component.scss'],
    animations: [accountModuleAnimation()]
})
export class SupplyRegisterComponent extends AppComponentBase implements OnInit, OnDestroy {
    model: SupplementAuthModel = new SupplementAuthModel();
    readAndAgree = true;
    registering = false;

    @ViewChild('protocolModal') protocolModal: ProtocolModelComponent;
    constructor(
        private injector: Injector,
        private _router: Router,
        private _authService: AppAuthService,
        private _sessionService: AppSessionService,
        private _loginService: LoginService
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this._sessionService.tenantId) {
            this.message.warn(this.l('SupplRregister.IsRegisted'));
            this._router.navigate(['/']);
        }
    }

    ngOnDestroy() {
        this._authService.logout();
    }

    supplRregisterHandler(): void {
        this.registering = true;
        this._loginService.supplRregister(this.model, () => this.registering = false);
    }

    readProtocolModal(): void {
        this.protocolModal.show();
    }
}
