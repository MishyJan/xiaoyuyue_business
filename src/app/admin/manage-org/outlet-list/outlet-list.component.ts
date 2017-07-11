import { Component, OnInit, Injector } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { Router } from '@angular/router';
import { OutletServiceServiceProxy, PagedResultDtoOfOutletListDto, OutletListDto, ContactorEditDto } from 'shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { AppConsts } from 'shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'xiaoyuyue-outlet-list',
  templateUrl: './outlet-list.component.html',
  styleUrls: ['./outlet-list.component.scss'],
  animations: [accountModuleAnimation()],
})
export class OutletListComponent extends AppComponentBase implements OnInit {
  outletName: string;
  allOutlets: OutletListDto[];
  contactInfo: ContactorEditDto;
  itemsPerPage: number = AppConsts.grid.defaultPageSize;
  currentPage: number = 0;

  pageSize: number = AppConsts.grid.defaultPageSize;
  skip: number = 0;
  sort: Array<SortDescriptor> = [];

  constructor(
    injector: Injector,
    private _router: Router,
    private _outletServiceServiceProxy: OutletServiceServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loadData()
  }

  loadData(): void {
    let state = { skip: this.skip, take: this.pageSize, sort: this.sort };

    let maxResultCount, skipCount, sorting;
    if (state) {
      // maxResultCount = state.take;
      maxResultCount = 8;
      skipCount = state.skip
      if (state.sort.length > 0 && state.sort[0].dir) {
        sorting = state.sort[0].field + " " + state.sort[0].dir;
      }
    }

    this._outletServiceServiceProxy
      .getOutlets(this.outletName, sorting, maxResultCount, skipCount)
      .subscribe(result => {
        this.allOutlets = result.items;
      });
  }

  createOutlet(): void {
    this._router.navigate(['/app/admin/org/create']);
  }

  editHandler(outletId: number): void {
    this._router.navigate(['/app/admin/org/edit', outletId]);
  }
}
