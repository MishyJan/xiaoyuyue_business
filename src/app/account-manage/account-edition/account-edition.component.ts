import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { accountModuleAnimation } from 'shared/animations/routerTransition';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AccountEditionBuild } from 'app/shared/utils/account-edition';
import { ToPayModelComponent } from 'app/account-manage/account-edition/to-pay-model/to-pay-model.component';

@Component({
  selector: 'xiaoyuyue-account-edition',
  templateUrl: './account-edition.component.html',
  styleUrls: ['./account-edition.component.scss'],
  animations: [accountModuleAnimation()]

})
export class AccountEditionComponent extends AppComponentBase implements OnInit {
    accountEdition: AccountEditionBuild = new AccountEditionBuild();
    @ViewChild('toPayModel') toPayModel: ToPayModelComponent;
    constructor(
        private injector: Injector
    ) {
        super(
            injector
        );
    }

  ngOnInit() {
  }

  showToPayModel(): void {
      this.toPayModel.show();
  }

}
