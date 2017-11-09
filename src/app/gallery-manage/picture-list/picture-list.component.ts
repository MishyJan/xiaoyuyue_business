import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { PictureServiceProxy, PictureGroupListDto, IPictureGroupListDto, CreateOrUpdatePictureGroupInput, BatchMove2GroupInput } from 'shared/service-proxies/service-proxies';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { SelectedPicListDto } from 'app/shared/common/upload-picture-gallery/upload-picture-gallery.component';
import { TooltipDirective } from 'ngx-bootstrap';
import { element } from 'protractor';

@Component({
    selector: 'xiaoyuyue-picture-list',
    templateUrl: './picture-list.component.html',
    styleUrls: ['./picture-list.component.scss'],
    animations: [accountModuleAnimation()],

})
export class PictureListComponent extends AppComponentBase implements OnInit {
    // 移动弹窗的X轴偏移量
    moveGroupTemplateX: number;
    // 移动弹窗的Y轴偏移量
    moveGroupTemplateY: number;
    // 选中需要移动的分组ID
    selectedMoveGroupInput: BatchMove2GroupInput = new BatchMove2GroupInput();

    isMoveGroupTemplate: boolean;
    picGroupCreating: boolean;
    groupActiveIndex: number = 0;
    onceTime: number;
    twiceTime: number;
    clickNum: number = 0;
    // 是否可以编辑图片名称，存储数组
    editingPicName: boolean[] = [];
    // 是否可以编辑分组名称
    editingGroupName: boolean = false;
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
        document.addEventListener('click', () => {
            this.hideMoveGroupTemplate();
        });
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
            .subscribe(result => {
                this.notify.success('删除分组成功');
                this.loadPicGalleryData();
            })
    }
    // 更新分组名称
    updatePicGroupService(groupId: number, event: any): void {
        this.picGroupInputDto.id = groupId;
        this.picGroupInputDto.name = event.target.value;
        this._pictureServiceProxy
            .createOrUpdatePictureGroup(this.picGroupInputDto)
            .subscribe(result => {
                this.notify.success('更新分组成功');
                this.loadPicGalleryData();
            });
    }
    // 更新分组显示输入框
    showUpdatePicInput(): void {
        this.editingGroupName = true;
    }
    // 关闭更新分组显示输入框
    hideUpdatePicInput(): void {
        this.editingGroupName = false;
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

    // 删除某一分组的图片
    deletePicHandler(event: Event, data: SelectedPicListDto): void {
        event.stopPropagation();
        // data存在就是单个图片，不存在则是批量被选中的图片
        let picIds = [];
        if (data) {
            picIds[0] = data.picId;
        } else {
            picIds = [];
            this.selectedPicListArr.forEach(element => {
                picIds.push(element.picId);
            });
        }

        this.deletePicService(picIds);
    }
    // 删除某一分组的图片请求数据
    deletePicService(picIds: number[]): void {
        this._pictureServiceProxy
            .deleteAsync(picIds)
            .subscribe(result => {
                // 如果是批量移动成功情况下，则清空数据
                if (this.selectedPicListArr.length > 0) {
                    this.selectedPicListArr = [];
                }
                this.notify.success('删除成功');
                this.loadPicGalleryData();
            })
    }

    // 移动分组
    movePicHandler(event: any, data: SelectedPicListDto): void {
        event.stopPropagation();

        // data存在就是单个图片，不存在则是批量被选中的图片
        if (data) {
            this.selectedMoveGroupInput.ids[0] = data.picId;
        } else {
            this.selectedPicListArr.forEach(element => {
                this.selectedMoveGroupInput.ids.push(element.picId);
            });
        }

        this.moveGroupTemplateX = event.pageX;
        this.moveGroupTemplateY = event.pageY;
        this.showMoveGroupTemplate();
    }

    //  移动分组请求数据
    movePicToGroupService(): void {
        this._pictureServiceProxy
            .batchMove2Group(this.selectedMoveGroupInput)
            .subscribe(result => {
                // 如果是批量移动成功情况下，则清空数据
                if (this.selectedPicListArr.length > 0) {
                    this.selectedPicListArr = [];
                }
                this.notify.success('移动成功');
                this.hideMoveGroupTemplate();
                this.loadPicGalleryData();
            });
    }

    // 选择图片库图片，保存选中数据
    selectPicHandler(data: SelectedPicListDto, index: number): void {
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

    groupItemActive(groupItem: IPictureGroupListDto, groupActiveIndex: number): void {
        if (groupActiveIndex === this.groupActiveIndex) {
            return;
        }
        this.groupActiveIndex = groupActiveIndex;
        this.selectedGroupId = groupItem.id;
        this.loadAllPicAsync();
    }

    picRename(name: string): string {
        return name ? name : '未命名';
        // return name ? name = name.substr(0,6)+'...' : '未命名';
    }

    //  双击编辑图片名称
    editingPicNameHandler(event: Event, selectPicIndex: number): void {
        this.editingPicName[selectPicIndex] = true;
        $(event.target).find('input').trigger('focus');
    }

    //  回车保存图片名称
    picRenameEnter(event: any, selectPicIndex: number): void {
        this.editingPicName[selectPicIndex] = false;
        // this.selectedPicListArr[selectPicIndex].name = event.target.value;
        $(event.target).trigger('blur');
    }

    // 分页
    public onPageChange(index: number): void {
        this.currentPage = index;
        this.gridParam.SkipCount = this.maxResultCount * (this.currentPage - 1);
        this.loadAllPicAsync()
    }

    private showMoveGroupTemplate(): void {
        this.isMoveGroupTemplate = true;
    }
    private hideMoveGroupTemplate(): void {
        this.isMoveGroupTemplate = false;
    }
}
