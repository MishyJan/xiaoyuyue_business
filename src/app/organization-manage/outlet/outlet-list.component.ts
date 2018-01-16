import * as _ from 'lodash';

import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { ContactorEditDto, OutletListDto, OutletServiceServiceProxy, PagedResultDtoOfOutletListDto } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { BaseLsitDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { ListScrollService } from 'shared/services/list-scroll.service';
import { Router } from '@angular/router';
import { SortDescriptor } from '@progress/kendo-data-query';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { ScrollStatusOutput } from 'app/shared/utils/list-scroll.dto';

@Component({
    selector: 'xiaoyuyue-outlet-list',
    templateUrl: './outlet-list.component.html',
    styleUrls: ['./outlet-list.component.scss'],
    animations: [accountModuleAnimation()],
})
export class OutletListComponent extends AppComponentBase implements OnInit, AfterViewInit {
    scrollStatusOutput: ScrollStatusOutput;
    updateDataIndex = -1;
    // 将单次获取到的数据，追加到数组，作用：上拉加载功能
    allOutletsResultData: any[] = [];
    // 单次获取数据
    outletsResultData: OutletListDto[] = [];

    outletName: string;
    contactInfo: ContactorEditDto;

    listParam = new BaseLsitDataInputDto();
    searching = false;
    pictureDefaultBgUrl = '/assets/common/images/login/bg1.jpg';
    slogan = this.l('Nothing.Need2Create');

    constructor(
        injector: Injector,
        private _router: Router,
        private _listScrollService: ListScrollService,
        private _outletServiceServiceProxy: OutletServiceServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.loadData()
    }

    ngAfterViewInit() {
    }

    searchData(): void {
        this.searching = true;
        this.loadData();
    }

    // scrollHandleBack: 接收一个回调函数，控制下拉刷新，上拉加载的状态
    loadData(scrollHandleBack?: any): void {
        this._outletServiceServiceProxy
            .getOutlets(this.outletName, this.listParam.Sorting, this.listParam.MaxResultCount, this.listParam.SkipCount)
            .finally(() => {
                this.searching = false;
                scrollHandleBack && scrollHandleBack();
            })
            .subscribe(result => {
                this.listParam.TotalItems = result.totalCount;
                this.outletsResultData = result.items;
                if (this.outletsResultData.length > 0 && this.updateDataIndex < 0) {
                    this.allOutletsResultData.push(this.outletsResultData);
                } else {
                    this.allOutletsResultData[this.updateDataIndex] = this.outletsResultData;
                }
            });
    }

    pullDownRefresh(): void {
        this.updateDataIndex = 0;
        this.listParam.SkipCount = 0;
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledDownActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.loadData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.pulledDownActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }

    pullUpLoad(): void {
        this.updateDataIndex = -1;
        let totalCount = 0;
        this.allOutletsResultData.forEach(organizationBookingResultData => {
            organizationBookingResultData.forEach(element => {
                totalCount++;
            });
        });
        this.listParam.SkipCount = totalCount;
        if (this.listParam.SkipCount >= this.listParam.TotalItems) {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.noMore = true;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
            return;
        }
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledUpActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.loadData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.pulledUpActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }

    createOutlet(): void {
        this._router.navigate(['/outlet/create']);
    }

    editHandler(outletId: number): void {
        this._router.navigate(['/outlet/edit', outletId]);
    }

    onPageChange(index: number): void {
        this.listParam.CurrentPage = index;
        this.listParam.SkipCount = this.listParam.MaxResultCount * this.listParam.CurrentPage;
        this.loadData();
    }

    // 获取门店背景
    getOutletBgUrl(pictureUrl): string {
        if (pictureUrl !== '') {
            return pictureUrl;
        }
        return this.pictureDefaultBgUrl;
    }
}
