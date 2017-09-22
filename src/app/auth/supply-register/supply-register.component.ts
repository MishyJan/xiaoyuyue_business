import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { TokenAuthServiceProxy, SupplementAuthModel, SupplementAuthResultModel } from '@shared/service-proxies/service-proxies';
import { LoginService } from 'shared/services/login.service';

@Component({
    selector: 'xiaoyuyue-supply-register',
    templateUrl: './supply-register.component.html',
    styleUrls: ['./supply-register.component.scss'],
    animations: [accountModuleAnimation()]
})
export class SupplyRegisterComponent extends AppComponentBase implements OnInit {
    model: SupplementAuthModel = new SupplementAuthModel();
    constructor(
        private injector: Injector,
        private _loginService: LoginService
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    supplRregisterHandler(): void {
        this._loginService.supplRregister(this.model);
    }
}
