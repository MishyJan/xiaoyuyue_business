import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from 'shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountListComponent extends AppComponentBase implements OnInit {
    constructor(
        private injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit() {
    }
}
