import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'xiaoyuyue-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  animations: [accountModuleAnimation()]
})
export class SecurityComponent extends AppComponentBase implements OnInit {

    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

  ngOnInit() {
  }

}
