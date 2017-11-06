import '@node_modules/qiniu-js/dist/qiniu.min';

import { BookingPictureEditDto, IPictureGroupListDto, PagedResultDtoOfPictureListDto, PictureGroupListDto, PictureListDto, PictureServiceProxy, UpdateProfilePictureInput, UploadTokenOutput } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { IAjaxResponse } from 'abp-ng2-module/src/abpHttp';
import { ModalDirective } from 'ngx-bootstrap';
import { UploadPictureService } from './../../../../shared/services/upload-picture.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

export class SelectedPicListDto {
    name: string;
    picUrl: string;
    picId: number;
    selected: boolean;
}

@Component({
    selector: 'xiaoyuyue-upload-picture-gallery',
    templateUrl: './upload-picture-gallery.component.html',
    styleUrls: ['./upload-picture-gallery.component.scss'],
    animations: [accountModuleAnimation()],
    providers: [SelectedPicListDto]
})

export class UploadPictureGalleryComponent extends AppComponentBase implements OnInit {
    uploader: any;
    key: string;
    imageMogr2Link: string;
    existsBookingPictureEdit: any;
    selectedPicList: SelectedPicListDto = new SelectedPicListDto();
    selectedPicListArr: SelectedPicListDto[] = [];

    // 获取最大页码数
    maxPageNum: number;
    // 保存当前页码的数据是否选中的数据
    totalItems: number;
    currentPage = 0;
    maxResultCount = 12;

    selectedPicIndex: number;

    groupActiveIndex: number = 0;
    picGroupItemData: SelectedPicListDto[] = [];
    defaultPicGalleryGroupId: number;
    picGalleryGroupData: PictureGroupListDto[];
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto();

    loading = false;
    tabToggle = true;

    // 是否多选图片
    isMutliPic: boolean = true;

    // 记录已选中图片的数据
    public selectedPicData: PictureListDto[] = [];
    // 最大上传图片数量
    public maxPicNum = 4;
    public allPictureUrl: SafeUrl[] = [];
    public allPictureId: number[] = [];
    public pictureForEdit: BookingPictureEditDto = new BookingPictureEditDto();
    public picGalleryForEdit: BookingPictureEditDto[] = [];
    public temporaryPictureUrl: string;
    public safeTemporaryPictureUrl: SafeUrl;
    public domain = 'http://image.xiaoyuyue.com/';

    private temporaryPictureFileName: string;
    private _$profilePicture: JQuery;

    @Input() groupId: number = 0;
    @Input() existingPicNum: number;
    @Input() cropScaleX: number = 1;
    @Input() cropScaleY: number = 1;
    @Output() getAllPictureUrl: EventEmitter<SafeUrl[]> = new EventEmitter();
    @Output() sendPictureForEdit: EventEmitter<BookingPictureEditDto> = new EventEmitter();
    @Output() sendPicGalleryForEdit: EventEmitter<BookingPictureEditDto[]> = new EventEmitter();
    @ViewChild('uploadPictureModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _pictureServiceProxy: PictureServiceProxy,
        private _uploadPictureService: UploadPictureService,
        private _appSessionService: AppSessionService,
        private sanitizer: DomSanitizer
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    /* 上传图片时的索引值，用于更换某个索引值的图片数据 */
    show(bookingPictureEdit?: any, isMutliPic?: boolean): void {
        if (bookingPictureEdit) {
            this.isMutliPic = isMutliPic;
            this.existsBookingPictureEdit = bookingPictureEdit
        }
        this.modal.show();
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
                this.totalItems = result.totalCount;
                this.picGroupItemData = [];
                result.items.forEach((pagesItem, inx) => {
                    this.selectedPicList = new SelectedPicListDto();
                    this.selectedPicList.picId = pagesItem.id;
                    this.selectedPicList.picUrl = pagesItem.originalUrl;
                    this.selectedPicList.name = pagesItem.name;
                    this.selectedPicList.selected = false;

                    if (this.existsBookingPictureEdit.pictureId && this.existsBookingPictureEdit.pictureId == pagesItem.id) {
                        this.selectedPicList.selected = true;
                    }
                    if (this.existsBookingPictureEdit.length > 0) {
                        this.existsBookingPictureEdit.forEach(element => {
                            if (element.pictureId == pagesItem.id) {
                                this.selectedPicList.selected = true;
                            }
                        });
                    }
                    this.picGroupItemData.push(this.selectedPicList);
                    if (this.selectedPicListArr.length > 0) {
                        this.selectedPicListArr.forEach((selectedPicListArrItem) => {
                            if (selectedPicListArrItem.picId === pagesItem.id) {
                                (this.picGroupItemData[inx].selected = true);
                            }
                        });
                    }
                });
                this.maxPageNum = Math.ceil(this.totalItems / this.maxResultCount);
            })
    }

    public confirmGallerySelect(): void {
        this.saveSelectPicData();
        // 把数据传给父组件
        this.sendPicGalleryForEdit.emit(this.picGalleryForEdit);
        this.picturyGalleryDestroy();
        this.close();
    }

    // 选择图片库图片，保存选中数据
    public selectPicHandler(data: SelectedPicListDto, index: number): void {
        this.selectedPicIndex = index;
        this.selectedPicList = new SelectedPicListDto();
        this.selectedPicList.picId = data.picId;
        this.selectedPicList.picUrl = data.picUrl;


        let existedIndex = -1;

        if (this.isMutliPic) {
            data.selected = !data.selected;
            this.selectedPicList.selected = data.selected;
            this.selectedPicListArr.forEach((element, inx) => {
                if (element.picId === data.picId) {
                    existedIndex = inx;
                }
            });

            if (existedIndex > -1) {
                this.selectedPicListArr.splice(existedIndex, 1);
            } else {

                this.selectedPicListArr.push(this.selectedPicList);
                // 图片数量超过限制警告
                if (this.setPicElectiveNum() < 0) {
                    this.selectedPicListArr.splice(this.selectedPicListArr.length - 1, 1);
                    this.message.warn('图片超过上限');
                }
            }
        } else {
            this.selectedPicListArr[0] = this.selectedPicList;
            this.picGroupItemData.forEach(element => {
                element.selected = false;
                if (element.picId === this.selectedPicListArr[0].picId) {
                    element.selected = true;
                }
            });
        }
    }

    // 获取可选择图片的数量
    public setPicElectiveNum(): number {
        return this.maxPicNum - this.existingPicNum - this.setPicSelectNum();
    }

    // 获取选中图片数组中，返回已选择的数据长度
    public setPicSelectNum(): number {
        let length = 0;
        this.selectedPicListArr.forEach(element => {
            if (element.selected === true) {
                length++;
            }
        });
        return length;
    }

    // 销毁图片库的数据
    private picturyGalleryDestroy(): void {
        this.selectedPicListArr = [];
    }

    // 保存已选中的数据
    private saveSelectPicData(): void {
        this.picGalleryForEdit = [];
        if (this.selectedPicListArr.length > 0) {
            // 将图片分组数据转DTO
            this.selectedPicListArr.forEach((element, inx) => {
                let temp = new BookingPictureEditDto();
                // temp.displayOrder = inx;
                temp.pictureId = element.picId;
                temp.pictureUrl = element.picUrl;
                this.picGalleryForEdit.push(temp);
            });
        }
    }

    // 分页
    public onPageChange(index: number): void {
        this.currentPage = index;
        this.gridParam.SkipCount = this.maxResultCount * (this.currentPage - 1);
        this.loadAllPicAsync()
    }

    public groupItemActive(groupItem: IPictureGroupListDto, groupActiveIndex: number): void {
        this.groupActiveIndex = groupActiveIndex;
        this.groupId = groupItem.id;
        this.loadAllPicAsync();
    }

    initFileUploader(): void {
        const self = this;
        self.allPictureUrl = [];
        this._uploadPictureService
            .getPictureUploadToken()
            .then(token => {
                self._$profilePicture = $('#profilePicture');

                const Q1 = new QiniuJsSDK();
                self.uploader = Q1.uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: 'uploadArea',       // 上传选择的点选按钮，**必需**
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    domain: self.domain,   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    container: 'uploadAreaWrap',           // 上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '5mb',           // 最大文件体积限制
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: false,                   // 开启可拖曳上传
                    // drop_element: 'dropArea',        // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                // 分块上传时，每片的体积
                    // resize: {
                    //     crop: false,
                    //     quality: 60,
                    //     preserve_headers: false
                    // },
                    auto_start: false,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    filters: {
                        max_file_size: '5mb',
                        prevent_duplicates: true,
                        mime_types: [
                            { title: 'Image files', extensions: 'jpg,gif,png' },  // 限定jpg,gif,png后缀上传
                        ]
                    },
                    x_vars: {
                        groupid: function (up, file) {
                            return self.groupId;
                        },
                        imageMogr2: function () {
                            return self.imageMogr2Link;
                        }
                    },
                    init: {
                        'FilesAdded': (up, files) => {
                            self.picturyDestroy();
                            plupload.each(files, function (file) {
                                // 文件添加进队列后,处理相关的事情
                                // 上传之前本地预览
                                for (let i = 0; i < files.length; i++) {
                                    const fileItem = files[i].getNative(),
                                        url = window.URL;
                                    const src = url.createObjectURL(fileItem);
                                    console.log(files);

                                    // self.temporaryPictureUrl = src;
                                    // self.safeTemporaryPictureUrl = self.sanitizer.bypassSecurityTrustResourceUrl(self.temporaryPictureUrl);
                                    // self.allPictureUrl.push(self.safeTemporaryPictureUrl);
                                    self._$profilePicture.attr('src', src);

                                    self._$profilePicture.cropper({
                                        dragMode: 'move',
                                        viewMode: 1,
                                        aspectRatio: self.cropScaleX / self.cropScaleY,
                                        crop: function (e) {
                                            let cropValue = `!${e.width}x${e.height}a${e.x}a${e.y}`;
                                            self.imageMogr2Link = Q1.imageMogr2({
                                                'auto-orient': true,  // 布尔值，是否根据原图EXIF信息自动旋正，便于后续处理，建议放在首位。
                                                strip: false,   // 布尔值，是否去除图片中的元信息
                                                // thumbnail: '1000x1000',   // 缩放操作参数
                                                crop: cropValue,  // 裁剪操作参数
                                                gravity: 'NorthWest',    // 裁剪锚点参数
                                                quality: 65,  // 图片质量，取值范围1-100
                                                // rotate: 20,   // 旋转角度，取值范围1-360，缺省为不旋转。
                                                // format: 'jpg',// 新图的输出格式，取值范围：jpg，gif，png，webp等
                                                // blur: '3x5'    // 高斯模糊参数
                                            });
                                        }
                                    });
                                }
                            });
                        },
                        'BeforeUpload': (up, file) => {
                            self.loading = true;
                            // 每个文件上传前,处理相关的事情
                            self.loading = true;
                        },
                        'UploadProgress': (up, file) => {
                            // 每个文件上传时,处理相关的事情
                        },
                        'FileUploaded': (up, file, info) => {
                            const result = JSON.parse(info).result;
                            self.pictureForEdit.pictureId = result.pictureId;
                            self.pictureForEdit.pictureUrl = result.originalUrl;
                            self.sendPictureForEdit.emit(self.pictureForEdit);
                            self.loading = false;
                            self.close();
                        },
                        'Error': (up, err, errTip) => {
                            // 上传出错时,处理相关的事情
                            self.loading = false;
                            self.close();
                            if (err.code === -602) {
                                return;
                            }
                            self.notify.error('上传失败，请重新上传');
                        },
                        'UploadComplete': () => {
                            // 队列文件处理完毕后,处理相关的事情
                            self.close();
                        },
                        'Key': (up, file) => {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            const id = this._appSessionService.tenantId;
                            const groupId = this.groupId;
                            const date = new Date();
                            const timeStamp = date.getTime().valueOf();
                            this.key = `${id}/${groupId}/${timeStamp}`;
                            return this.key
                        }
                    }
                });

                $('#confirmUpload').on('click', () => {
                    this.uploader.start();
                })
            });
    }

    confirmUpload(): void {
        this.close();
    }

    close(): void {
        this.modal.hide();
        if (this.tabToggle) {
            return;
        }
        this.picturyDestroy();
    }

    isShowPictureGallery(): void {
        this.tabToggle = true;
    }

    isShowLocalUpload(): void {
        this.tabToggle = false;
    }
    // 在下次本地上传弹窗时，销毁已上传的数据
    picturyDestroy(): void {
        this.pictureForEdit = new BookingPictureEditDto();
        this._$profilePicture.removeAttr('src');
        this._$profilePicture.cropper("destroy");
    }

    // bootstrap modal显示事件
    public onBSShown() {
        console.log(1);
        this.initFileUploader();
    }

    // bootstrap modal关闭事件
    public onBSHide() {
        this.uploader.destroy();
        this.picturyDestroy();
    }
}
