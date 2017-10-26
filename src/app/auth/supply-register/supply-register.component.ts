import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { TokenAuthServiceProxy, SupplementAuthModel, SupplementAuthResultModel } from '@shared/service-proxies/service-proxies';
import { LoginService } from 'shared/services/login.service';
import { ProtocolModelComponent } from 'app/auth/register/protocol-model/protocol-model.component';

@Component({
    selector: 'xiaoyuyue-supply-register',
    templateUrl: './supply-register.component.html',
    styleUrls: ['./supply-register.component.scss'],
    animations: [accountModuleAnimation()]
})
export class SupplyRegisterComponent extends AppComponentBase implements OnInit {
    model: SupplementAuthModel = new SupplementAuthModel();
    readAndAgree: boolean = true;
    registering: boolean = false;

    @ViewChild('protocolModal') protocolModal: ProtocolModelComponent;
    constructor(
        private injector: Injector,
        private _loginService: LoginService
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    supplRregisterHandler(): void {
        this.registering = true;
        this._loginService.supplRregister(this.model, () => this.registering = false);
    }

    readProtocolModal(): void {
        this.protocolModal.show();
    }
}
