import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';

@Component({
    selector: 'xiaoyuyue-acount-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountSecurityComponent extends AppComponentBase implements OnInit {
    @ViewChild('changePasswdModel') changePasswdModel: ChangePasswdModelComponent;

    constructor(
        private injector: Injector
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
    }

    showChangePasswdModel(): void {
        this.changePasswdModel.show();
    }

}
