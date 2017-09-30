import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BindingPhoneModelComponent } from './phone-model/binding-phone-model/binding-phone-model.component';
import { UnbindingPhoneModelComponent } from './phone-model/unbinding-phone-model/unbinding-phone-model.component';

@Component({
    selector: 'xiaoyuyue-acount-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountSecurityComponent extends AppComponentBase implements OnInit {
    @ViewChild('changePasswdModel') changePasswdModel: ChangePasswdModelComponent;
    @ViewChild('bindingPhoneModel') bindingPhoneModel: BindingPhoneModelComponent;
    @ViewChild('unbindingPhoneModel') unbindingPhoneModel: UnbindingPhoneModelComponent;

    constructor(
        private injector: Injector,
        private _appSessionService: AppSessionService
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
    }

    isBindingPhone(): boolean {
        // 已绑定手机返回true
        return this._appSessionService.user.phoneNumber ? true : false;
    }

    showChangePasswdModel(): void {
        this.changePasswdModel.show();
    }

    showChangePhoneModel(): void {
        this.unbindingPhoneModel.show();
    }

    showBindingPhoneModel(): void {
        this.bindingPhoneModel.show();
    }

}
