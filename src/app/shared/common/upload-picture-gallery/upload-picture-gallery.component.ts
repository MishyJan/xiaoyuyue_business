import '@node_modules/qiniu-js/dist/qiniu.min';

import { BookingPictureEditDto, IPictureGroupListDto, PagedResultDtoOfPictureListDto, PictureGroupListDto, PictureListDto, PictureServiceProxy, UpdateProfilePictureInput, UploadTokenOutput } from 'shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { IAjaxResponse } from 'abp-ng2-module/src/abpHttp';
import { ModalDirective } from 'ngx-bootstrap';
import { TokenService } from 'abp-ng2-module/src/auth/token.service';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { element } from 'protractor';

@Component({
    selector: 'xiaoyuyue-upload-picture-gallery',
    templateUrl: './upload-picture-gallery.component.html',
    styleUrls: ['./upload-picture-gallery.component.scss'],
    animations: [accountModuleAnimation()]
})

export class UploadPictureGalleryComponent extends AppComponentBase implements OnInit {
    selectedPicIndex: number;
    selectedPicIndexArr: boolean[] = [];

    groupActiveIndex: number = 0;
    picGroupItemData: PictureListDto[];
    groupId: number;
    defaultPicGalleryGroupId: number;
    picGalleryGroupData: PictureGroupListDto[];
    gridParam: BaseGridDataInputDto = new BaseGridDataInputDto();

    loading = false;
    tabToggle = true;

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

    @Input() existingPicNum: number;
    @Output() getAllPictureUrl: EventEmitter<SafeUrl[]> = new EventEmitter();
    @Output() sendPictureForEdit: EventEmitter<BookingPictureEditDto> = new EventEmitter();
    @Output() sendPicGalleryForEdit: EventEmitter<BookingPictureEditDto[]> = new EventEmitter();
    @ViewChild('uploadPictureModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _tokenService: TokenService,
        private _pictureServiceProxy: PictureServiceProxy,
        private sanitizer: DomSanitizer
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    /* 上传图片时的索引值，用于更换某个索引值的图片数据 */
    show(): void {
        this.modal.show();
        this.loadPicGalleryData();
        this.loadAllPicAsync();
    }

    // 获取图片库所有分组数据
    loadPicGalleryData(): void {
        this._pictureServiceProxy
            .getPictureGroupAsync()
            .subscribe(result => {
                this.picGalleryGroupData = result;
                this.groupId = this.defaultPicGalleryGroupId = result[0].id;
            })
    }

    // 根据分组ID获取某分组下所有图片数据
    loadAllPicAsync(): void {
        this._pictureServiceProxy
            .getPictureAsync(
            this.groupId,
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount
            )
            .subscribe(result => {
                this.picGroupItemData = result.items;
            })
    }

    public confirmGallerySelect(): void {
        // 把数据传给父组件
        this.sendPicGalleryForEdit.emit(this.picGalleryForEdit);
        this.close();
    }

    // 选择图片库图片，保存选中数据
    public selectPicHandler(index: number): void {
        // 可选择的数量
        let electiveNum = this.maxPicNum - this.existingPicNum;
        let selectedNum = 0;

        this.selectedPicData = [];
        this.picGalleryForEdit = [];

        this.selectedPicIndex = index;
        this.selectedPicIndexArr[index] = !this.selectedPicIndexArr[index];

        // 获取图片分组数据
        this.selectedPicIndexArr.forEach((element, inx) => {
            if (element === true) {
                if (this.selectedPicData.length >= 4) {
                    return;
                }
                this.selectedPicData.push(this.picGroupItemData[inx]);
            } else {
                this.selectedPicData.splice(inx, 1);
            }
        });

        // 将图片分组数据转DTO
        this.selectedPicData.forEach((element, inx) => {
            let temp = new BookingPictureEditDto();
            // temp.displayOrder = inx;
            temp.pictureId = element.id;
            temp.pictureUrl = element.originalUrl;
            this.picGalleryForEdit.push(temp);
        });

        // 图片数量超过限制警告
        if (this.setPicElectiveNum() < 0) {
            this.selectedPicIndexArr[index] = !this.selectedPicIndexArr[index];
            this.message.warn('图片超过上限');
        }

    }

    // 获取可选择图片的数量
    public setPicElectiveNum(): number {
        return this.maxPicNum - this.existingPicNum - this.setPicSelectNum();;
    }

    // 获取选中图片数组中，返回已选择的数据长度
    public setPicSelectNum(): number {
        let length = 0;
        this.selectedPicIndexArr.forEach(element => {
            if (element === true) {
                length++;
            }
        });
        return length;
    }

    public groupItemActive(groupItem: IPictureGroupListDto, groupActiveIndex: number): void {
        this.groupActiveIndex = groupActiveIndex;
        this.groupId = groupItem.id;
        this.loadAllPicAsync();
    }

    initFileUploader(): void {
        const self = this;
        self.allPictureUrl = [];
        let token = '';
        this._pictureServiceProxy
            .getPictureUploadToken()
            .subscribe(result => {
                token = result.token;
                self._$profilePicture = $('#profilePicture');

                // 引入Plupload 、qiniu.js后
                const Q1 = new QiniuJsSDK();
                const uploader = Q1.uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: 'uploadArea',       // 上传选择的点选按钮，**必需**
                    // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'http://image.xiaoyuyue.com/',   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    container: 'uploadAreaWrap',           // 上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '100mb',           // 最大文件体积限制
                    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: true,                   // 开启可拖曳上传
                    drop_element: 'dropArea',        // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                // 分块上传时，每片的体积
                    resize: {
                        crop: false,
                        quality: 60,
                        preserve_headers: false
                    },
                    auto_start: false,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    x_vars: {
                        groupid: function (up, file) {
                            return 1;
                        }
                    },
                    /*x_vals: {
                      'groupid': 1
                    },*/
                    init: {
                        'FilesAdded': (up, files) => {
                            plupload.each(files, function (file) {
                                // 文件添加进队列后,处理相关的事情

                                // 上传之前本地预览
                                for (let i = 0; i < files.length; i++) {
                                    const fileItem = files[i].getNative(),
                                        url = window.URL;
                                    const src = url.createObjectURL(fileItem);
                                    // self.temporaryPictureUrl = src;
                                    // self.safeTemporaryPictureUrl = self.sanitizer.bypassSecurityTrustResourceUrl(self.temporaryPictureUrl);
                                    // self.allPictureUrl.push(self.safeTemporaryPictureUrl);
                                    self._$profilePicture.attr('src', src);
                                    self._$profilePicture.attr('width', '100%');
                                }
                            });
                        },
                        'BeforeUpload': (up, file) => {
                            // 每个文件上传前,处理相关的事情
                            // self.modal.hide();
                        },
                        'UploadProgress': (up, file) => {
                            // 每个文件上传时,处理相关的事情
                            self.loading = true;
                        },
                        'FileUploaded': (up, file, info) => {
                            // 每个文件上传成功后,处理相关的事情
                            // 其中 info 是文件上传成功后，服务端返回的json，形式如
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html


                            // var res = parseJSON(info);
                            // this._$profilePicture = domain + res.key; //获取上传成功后的文件的Url
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
                            self.picturyDestroy();
                            self.notify.error('上传失败，请重新上传');
                        },
                        'UploadComplete': () => {
                            // 队列文件处理完毕后,处理相关的事情
                            self.pictureForEdit = new BookingPictureEditDto();
                            self._$profilePicture.removeAttr('src');
                            self._$profilePicture.removeAttr('width');
                            self.close();
                        },
                        'Key': (up, file) => {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            const id = 1;
                            const outletId = 4;
                            const date = new Date();
                            const timeStamp = date.getTime().valueOf();
                            const key = `${id}/${outletId}/${timeStamp}`;
                            // do something with key here

                            // var domain = up.getOption('domain');
                            // self.pictureForEdit.pictureUrl = domain + key;
                            return key
                        }
                    }
                });
                $('#confirmUpload').on('click', () => {
                    uploader.start();
                })
                // 销毁实例
                $('#cancelUpload').on('click', () => {
                    uploader.destroy();
                });
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
        this.initFileUploader();
    }
    // 上传图销毁
    picturyDestroy(): void {
        this.pictureForEdit = new BookingPictureEditDto();
        this._$profilePicture.removeAttr('src');
        this._$profilePicture.removeAttr('width');
    }
}
