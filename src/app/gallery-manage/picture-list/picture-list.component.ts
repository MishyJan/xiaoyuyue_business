import { BatchMove2GroupInput, CreateOrUpdatePictureGroupInput, IPictureGroupListDto, PictureGroupListDto, PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { SelectedPicListDto } from 'app/shared/common/upload-picture-gallery/upload-picture-gallery.component';
import { TooltipDirective } from 'ngx-bootstrap';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { UploadPictureNoneGalleryComponent } from 'app/shared/common/upload-picture-none-gallery/upload-picture-none-gallery.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { element } from 'protractor';
import { fail } from 'assert';

export class PictureGroupListActiveDto extends PictureGroupListDto {
    active: boolean;
}
@Component({
    selector: 'xiaoyuyue-picture-list',
    templateUrl: './picture-list.component.html',
    styleUrls: ['./picture-list.component.scss'],
    animations: [accountModuleAnimation()],

})
export class PictureListComponent extends AppComponentBase implements OnInit {
    allSelected: boolean;
    selectedGroupName: string;
    // 保存正在编辑分组名称的索引值
    editingGroupNameIndex: number;
    checkAllText = this.l('CheckAll');
    // 移动弹窗的X轴偏移量
    moveGroupTemplateX: number;
    // 移动弹窗的Y轴偏移量
    moveGroupTemplateY: number;
    // 选中需要移动的分组ID
    selectedMoveGroupInput: BatchMove2GroupInput = new BatchMove2GroupInput();

    isMoveGroupTemplate: boolean;
    picGroupCreating: boolean;
    groupActiveIndex = 0;
    onceTime: number;
    twiceTime: number;
    clickNum = 0;
    // 是否可以编辑图片名称，存储数组
    editingPicName: boolean[] = [];
    // 是否可以编辑分组名称
    editingGroupName = false;
    currentPage = 0;
    picGroupItemData: SelectedPicListDto[] = [];
    totalItems: number;
    maxResultCount = 12;
    selectedGroupId: number;
    picGalleryGroupData: PictureGroupListDto[];
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto();
    selectedPicListArr: SelectedPicListDto[] = [];
    moving = false;
    deleting = false;
    picGroupInputDto: CreateOrUpdatePictureGroupInput = new CreateOrUpdatePictureGroupInput();
    uploadUid: number = new Date().valueOf();
    @Output() pictureInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
    @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;

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
            this.hideUpdatePicInput();
            this.closeCreatePicGroup();
        });
    }

    // 获取图片库所有分组数据
    loadPicGalleryData(): void {
        this._pictureServiceProxy
            .getPictureGroupAsync()
            .subscribe(result => {
                this.picGalleryGroupData = result;
                this.picGalleryGroupData.forEach((groupItem: PictureGroupListActiveDto) => {
                    groupItem.active = false;
                });
                this.selectedGroupId = this.selectedGroupId ? this.selectedGroupId : DefaultUploadPictureGroundId.AllGroup;
                this.selectedGroupName = this.l('PictureGallery.Group.Default.All');
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
                this.notify.success(this.l('PictureGallery.Group.CreateSuccess'));
                this.closeCreatePicGroup();
                this.loadPicGalleryData();
            });
    }

    // 删除分组请求数据
    removePicGroupService(selectedGroupItem: PictureGroupListActiveDto): void {
        if (selectedGroupItem.active) { return; }
        selectedGroupItem.active = true;
        this._pictureServiceProxy
            .deleteGroupAsync(selectedGroupItem.id)
            .subscribe(result => {
                this.notify.success(this.l('PictureGallery.Group.DateleSuccess'));
                this.loadPicGalleryData();
            })
    }
    // 更新分组名称
    updatePicGroupService(groupId: number, event: any): void {
        this.picGroupInputDto.id = groupId;
        this.picGroupInputDto.name = $(event.target).parents('.sub-item').find('input').val() + '';

        this._pictureServiceProxy
            .createOrUpdatePictureGroup(this.picGroupInputDto)
            .subscribe(result => {
                this.notify.success(this.l('PictureGallery.Group.UpdateSuccess'));
                this.editingGroupName = false;
                this.loadPicGalleryData();
            });
    }
    // 更新分组显示输入框
    showUpdatePicInput(index: number): void {
        this.editingGroupNameIndex = index;
        this.editingGroupName = true;
    }
    // 关闭更新分组显示输入框
    hideUpdatePicInput(): void {
        this.editingGroupName = false;
    }

    //  创建分组显示输入框
    showCreatePicInput(event: Event): void {
        event.stopPropagation();
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
        this.deleting = true;
        this._pictureServiceProxy
            .deleteAsync(picIds)
            .finally(() => {
                this.deleting = false;
            })
            .subscribe(result => {
                // 如果是批量移动成功情况下，则清空数据
                if (this.selectedPicListArr.length > 0) {
                    this.selectedPicListArr = [];
                }
                if (this.allSelected) {
                    this.checkAllText = this.l('CheckAll');
                    this.allSelected = false;
                }
                this.notify.success(this.l('DeleteSuccess'));
                this.loadPicGalleryData();
            })
    }

    // 移动分组
    movePicHandler(event: any, data: SelectedPicListDto): void {
        if (event.pageX === 0 && event.pageY === 0) { return; }
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

    // 确认移动分组
    comfirmMovePicToGroup(): void {
        this.moving = true;
        this._pictureServiceProxy
            .batchMove2Group(this.selectedMoveGroupInput)
            .finally(() => {
                this.moving = false;
            })
            .subscribe(result => {
                // 如果是批量移动成功情况下，则清空数据
                if (this.selectedPicListArr.length > 0) {
                    this.selectedPicListArr = [];
                }
                if (this.allSelected) {
                    this.checkAllText = this.l('CheckAll');
                    this.allSelected = false;
                }
                this.notify.success(this.l('PictureGallery.MoveSeccessed'));
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
            this.checkAllText = this.l('CheckAll');
            this.allSelected = false;
        } else {
            this.selectedPicListArr.push(data);
            if (this.selectedPicListArr.length === this.picGroupItemData.length) {
                this.allSelected = true;
                this.checkAllText = this.l('Cancel');
            }
        }
    }

    // 切换分组
    changeGroupActive(groupItem: IPictureGroupListDto, groupActiveIndex: number): void {
        if (groupActiveIndex === this.groupActiveIndex) {
            return;
        }
        if (this.allSelected) {
            this.checkAllText = this.l('CheckAll');
            this.allSelected = false;
            this.allPicCancelSelected();
        }
        this.groupActiveIndex = groupActiveIndex;
        this.selectedGroupId = groupItem.id;
        this.selectedGroupName = groupItem.name;
        this.loadAllPicAsync();
    }

    picRename(name: string): string {
        return name ? name : this.l('PictureGallery.Group.Default.UnName');
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


    public eventStopPropagation(event: Event): void {
        event.stopPropagation();
    }

    public hideMoveGroupTemplate(): void {
        this.isMoveGroupTemplate = false;
    }

    // 全选和取消全选功能
    public allSelectedToggleHandler(): void {
        this.allSelected = !this.allSelected;
        if (this.allSelected) {
            this.allPicSelected();
        } else {
            this.allPicCancelSelected();
        }
    }

    // 全选所有的图片
    private allPicSelected(): void {
        this.picGroupItemData.forEach((ele, inx) => {
            this.selectedPicListArr[inx] = ele;
        });
        this.selectedPicListArr.forEach(ele => {
            ele.selected = true;
        });
        this.allSelected = true;
        this.checkAllText = this.l('Cancel');
    }

    // 取消所有全选的图片
    private allPicCancelSelected(): void {
        this.selectedPicListArr.forEach(ele => {
            ele.selected = false;
        });
        this.selectedPicListArr = [];
        this.allSelected = false;
        this.checkAllText = this.l('CheckAll');
    }

    // 分页
    public onPageChange(index: number): void {
        this.currentPage = index;
        this.gridParam.SkipCount = this.maxResultCount * (this.currentPage - 1);
        this.loadAllPicAsync()
    }

    // 弹出上传Model
    public uploadPicModel(): void {
        this.uploadPictureNoneGalleryModel.show();
    }

    // 获取图片上传URL
    public getPicUploadInfoHandler(pictureInfo: UploadPictureDto): void {
        this.notify.success(this.l('PictureGallery.UploadSeccessed') + this.selectedGroupName);
        this.loadPicGalleryData();
    }

    private showMoveGroupTemplate(): void {
        this.isMoveGroupTemplate = true;
    }
}
