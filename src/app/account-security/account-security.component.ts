import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'xiaoyuyue-acount-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.scss'],
  animations: [appModuleAnimation()]
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
