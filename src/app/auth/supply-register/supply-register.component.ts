import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { TokenAuthServiceProxy, SupplementAuthModel, SupplementAuthResultModel } from '@shared/service-proxies/service-proxies';
import { LoginService } from 'shared/services/login.service';
import { ProtocolModelComponent } from 'app/auth/register/protocol-model/protocol-model.component';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { Router } from '@angular/router';
import { AppAuthService } from 'app/shared/common/auth/app-auth.service';

@Component({
    selector: 'xiaoyuyue-supply-register',
    templateUrl: './supply-register.component.html',
    styleUrls: ['./supply-register.component.scss'],
    animations: [accountModuleAnimation()]
})
export class SupplyRegisterComponent extends AppComponentBase implements OnInit, OnDestroy {
    model: SupplementAuthModel = new SupplementAuthModel();
    readAndAgree: boolean = true;
    registering: boolean = false;

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
            this.message.warn('您不需要重复补充注册');
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
