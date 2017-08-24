import * as _ from 'lodash';

import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { ContactorEditDto, OutletListDto, OutletServiceServiceProxy, PagedResultDtoOfOutletListDto } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { PictureUrlHelper } from 'shared/helpers/PictureUrlHelper';
import { Router } from '@angular/router';
import { SortDescriptor } from '@progress/kendo-data-query';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-outlet-list',
    templateUrl: './outlet-list.component.html',
    styleUrls: ['./outlet-list.component.scss'],
    animations: [accountModuleAnimation()],
})
export class OutletListComponent extends AppComponentBase implements OnInit, AfterViewInit {
    outletName: string;
    allOutlets: OutletListDto[];
    contactInfo: ContactorEditDto;

    maxResultCount: number = AppConsts.grid.defaultPageSize;
    skipCount = 0;
    sorting: string;
    totalItems = 0;
    currentPage = 0;

    // 保存机构列表背景图的比例
    bookingBgW = 384;
    bookingBgH = 214;
    pictureDefaultBgUrl = '/assets/common/images/login/bg1.jpg';

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
        this._router.navigate(['/outlet/create']);
    }

    editHandler(outletId: number): void {
        this._router.navigate(['/outlet/edit', outletId]);
    }

    onPageChange(index: number): void {
        this.currentPage = index;
        this.skipCount = this.maxResultCount * this.currentPage;
        this.loadData();
    }

    // 获取门店背景
    getOutletBgUrl(pictureUrl): string {
        return pictureUrl === '' ? this.pictureDefaultBgUrl : PictureUrlHelper.getMinProfilePicCompressUrl(pictureUrl);
    }
}
