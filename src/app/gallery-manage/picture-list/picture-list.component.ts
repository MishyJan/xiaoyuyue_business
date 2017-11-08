import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { PictureServiceProxy, PictureGroupListDto } from 'shared/service-proxies/service-proxies';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';

@Component({
    selector: 'xiaoyuyue-picture-list',
    templateUrl: './picture-list.component.html',
    styleUrls: ['./picture-list.component.scss'],
    animations: [accountModuleAnimation()],

})
export class PictureListComponent extends AppComponentBase implements OnInit {
    totalItems: number;
    maxResultCount: number = 12;
    groupId: number;
    picGalleryGroupData: PictureGroupListDto[];
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto();
    
    constructor(
        private injector: Injector,
        private _pictureServiceProxy: PictureServiceProxy,

    ) {
        super(injector);
    }

    ngOnInit() {
        this.loadPicGalleryData();
    }

    // 获取图片库所有分组数据
    loadPicGalleryData(): void {
        this._pictureServiceProxy
            .getPictureGroupAsync()
            .subscribe(result => {
                this.picGalleryGroupData = result;
                this.groupId = result[0].id;
                this.loadAllPicAsync();
            })
    }

    // 根据分组ID获取某分组下所有图片数据
    loadAllPicAsync(): void {
        this.gridParam.MaxResultCount = this.maxResultCount;
        let self = this;
        this._pictureServiceProxy
            .getPictureAsync(
            this.groupId,
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount
            )
            .subscribe(result => {
                console.log(result);
            })
    }

}
