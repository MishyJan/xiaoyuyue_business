import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { PictureServiceProxy, PictureGroupListDto, IPictureGroupListDto, CreateOrUpdatePictureGroupInput } from 'shared/service-proxies/service-proxies';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { SelectedPicListDto } from 'app/shared/common/upload-picture-gallery/upload-picture-gallery.component';

@Component({
    selector: 'xiaoyuyue-picture-list',
    templateUrl: './picture-list.component.html',
    styleUrls: ['./picture-list.component.scss'],
    animations: [accountModuleAnimation()],

})
export class PictureListComponent extends AppComponentBase implements OnInit {
    picGroupCreating: boolean;
    groupActiveIndex: number = 0;
    onceTime: number;
    twiceTime: number;
    clickNum: number = 0;
    editingPicName: boolean[] = [];
    currentPage: number = 0;
    picGroupItemData: SelectedPicListDto[] = [];
    totalItems: number;
    maxResultCount: number = 12;
    selectedGroupId: number;
    picGalleryGroupData: PictureGroupListDto[];
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto();
    selectedPicListArr: SelectedPicListDto[] = [];

    picGroupInputDto: CreateOrUpdatePictureGroupInput = new CreateOrUpdatePictureGroupInput();

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
                this.selectedGroupId = result[0].id;
                this.loadAllPicAsync();
            })
    }

    // 根据分组ID获取某分组下所有图片数据
    loadAllPicAsync(): void {
        this.gridParam.MaxResultCount = this.maxResultCount;
        let self = this;
        this._pictureServiceProxy
            .getPictureAsync(
            this.selectedGroupId,
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount
            )
            .subscribe(result => {
                this.totalItems = result.totalCount;
                this.picGroupItemData = [];

                result.items.forEach((pagesItem, inx) => {
                    let picListItem = new SelectedPicListDto();
                    picListItem.picId = pagesItem.id;
                    picListItem.picUrl = pagesItem.originalUrl;
                    picListItem.name = pagesItem.name;
                    picListItem.selected = false;

                    this.picGroupItemData.push(picListItem);
                    if (this.selectedPicListArr.length > 0) {
                        this.selectedPicListArr.forEach((selectedPicListArrItem) => {
                            if (selectedPicListArrItem.picId === pagesItem.id) {
                                (this.picGroupItemData[inx].selected = true);
                            }
                        });
                    }
                });
            })
    }

    // 创建分组请求数据
    createPicGroupService(): void {
        this._pictureServiceProxy
            .createOrUpdatePictureGroup(this.picGroupInputDto)
            .subscribe(result => {
                this.notify.success('创建分组成功');
                this.closeCreatePicGroup();
                this.loadPicGalleryData();
            });
    }
    // 删除分组请求数据
    removePicGroupService(selectedGroupId: number): void {
        this._pictureServiceProxy
        .deleteGroupAsync(selectedGroupId)
        .subscribe( result => {
            this.notify.success('删除分组成功');
            this.loadPicGalleryData();
        })
    }
    //  创建分组显示输入框
    showCreatePicInput(): void {
        this.picGroupCreating = true;
        setTimeout(() => {
            $('#newGroupName').trigger('focus');
        }, 600);
    }
    //  关闭创建分组（隐藏input框，初始化数据）
    closeCreatePicGroup(): void {
        this.picGroupCreating = false;
        this.picGroupInputDto = new CreateOrUpdatePictureGroupInput();
    }

    // 选择图片库图片，保存选中数据
    public selectPicHandler(data: SelectedPicListDto, index: number): void {
        let selectedIndex = -1;
        data.selected = !data.selected;
        this.selectedPicListArr.forEach((element, inx) => {
            if (element.picId === data.picId) {
                selectedIndex = inx;
            }
        });
        if (selectedIndex > -1) {
            this.selectedPicListArr.splice(selectedIndex, 1);
        } else {
            this.selectedPicListArr.push(data);
        }
    }

    public groupItemActive(groupItem: IPictureGroupListDto, groupActiveIndex: number): void {
        this.groupActiveIndex = groupActiveIndex;
        this.selectedGroupId = groupItem.id;
        this.loadAllPicAsync();
    }

    // 分页
    public onPageChange(index: number): void {
        this.currentPage = index;
        this.gridParam.SkipCount = this.maxResultCount * (this.currentPage - 1);
        this.loadAllPicAsync()
    }

    private picRename(name: string): string {
        return name ? name : '未命名';
        // return name ? name = name.substr(0,6)+'...' : '未命名';
    }

    //  双击编辑图片名称
    private editingPicNameHandler(event: Event, selectPicIndex: number): void {
        this.editingPicName[selectPicIndex] = true;
        $(event.target).find('input').trigger('focus');
    }

    //  回车保存图片名称
    private picRenameEnter(event: any, selectPicIndex: number): void {
        this.editingPicName[selectPicIndex] = false;
        // this.selectedPicListArr[selectPicIndex].name = event.target.value;
        $(event.target).trigger('blur');
    }
}
