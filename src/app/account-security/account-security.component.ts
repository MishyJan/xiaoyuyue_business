import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'xiaoyuyue-acount-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.scss'],
  animations: [accountModuleAnimation()]
})
export class AccountSecurityComponent extends AppComponentBase implements OnInit {

    constructor(
        private injector: Injector
    ) {
        super(
            injector
        );
    }

  ngOnInit() {
  }

}
