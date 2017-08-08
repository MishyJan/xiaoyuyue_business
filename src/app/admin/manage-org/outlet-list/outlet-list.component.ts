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

    maxResultCount: number = AppConsts.grid.defaultPageSize;
    skipCount: number = 0;
    sorting: string;
    totalItems: number = 0;
    currentPage: number = 0;

    // 保存机构列表背景图的比例
    bookingBgW: number = 384;
    bookingBgH: number = 214;
    pictureDefaultBgUrl: string = "/assets/common/images/login/bg1.jpg";

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

    ngAfterViewInit() {
    }

    loadData(): void {

        this._outletServiceServiceProxy
            .getOutlets(this.outletName, this.sorting, this.maxResultCount, this.skipCount)
            .subscribe(result => {
                this.totalItems = result.totalCount;
                this.allOutlets = result.items;
            });
    }

    createOutlet(): void {
        this._router.navigate(['/app/admin/org/create']);
    }

    editHandler(outletId: number): void {
        this._router.navigate(['/app/admin/org/edit', outletId]);
    }

    onPageChange(index: number): void {
        this.currentPage = index;
        this.skipCount = this.maxResultCount * this.currentPage;
        this.loadData();
    }

    // 获取门店背景
    getOutletBgUrl(pictureUrl): string {
        return pictureUrl == '' ? this.pictureDefaultBgUrl : pictureUrl;
    }
}
