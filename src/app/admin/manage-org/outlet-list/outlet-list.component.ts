import { Component, OnInit, Injector } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import { Router } from '@angular/router';

@Component({
  selector: 'xiaoyuyue-outlet-list',
  templateUrl: './outlet-list.component.html',
  styleUrls: ['./outlet-list.component.scss'],
  animations: [accountModuleAnimation()],
})
export class OutletListComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loadData()
  }

  loadData(): void {

  }

  createOutlet(): void {
    this._router.navigate(['/app/admin/org/create']);
  }
}
