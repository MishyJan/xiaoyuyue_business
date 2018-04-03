import '@node_modules/qiniu-js/dist/qiniu.min';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { UploadPictureService } from 'shared/services/upload-picture.service';

@Component({
    selector: 'xiaoyuyue-mobile-upload-picture',
    templateUrl: './mobile-upload-picture.component.html',
    styleUrls: ['./mobile-upload-picture.component.scss']
})
export class MobileUploadPictureComponent extends AppComponentBase implements OnInit, OnChanges {
    imageMogr2Link: string;
    _$cropImg: JQuery<HTMLElement>;
    uploadPictureInfo: UploadPictureDto = new UploadPictureDto();
    uploadUid: number = Math.round(new Date().valueOf() * Math.random());
    tempUrl: string;
    isShowCropArea = false;
    uploading = false;

    @Input() width = '100%';
    @Input() height = '100%';
    @Input() borderRadius = '0';
    @Input() groupId = 0;
    @Input() slogan: string;
    @Input() existedPicUrl: string;
    @Input() cropScaleX = 1;
    @Input() cropScaleY = 1;
    @Output() picUploadInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();

    constructor(
        private injector: Injector,
        private _router: Router,
        private _sanitizer: DomSanitizer,
        private _appSessionService: AppSessionService,
        private _cookiesService: CookiesService,
        private _uploadPictureService: UploadPictureService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.initFileUploader();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.tempUrl = changes.existedPicUrl.currentValue;
    }

    initFileUploader(): void {
        const self = this;
        const container = 'uploadAreaWrap-' + this.uploadUid;
        const browse_button = 'uploadArea-' + this.uploadUid;
        this._uploadPictureService
            .getPictureUploadToken()
            .then(token => {
                // 引入Plupload 、qiniu.js后
                var Q1 = new QiniuJsSDK();
                self._$cropImg = $('#cropImg' + self.uploadUid);
                const uploader = Q1.uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: browse_button,       // 上传选择的点选按钮，**必需**
                    // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'http://image.xiaoyuyue.com/',   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    container: container,           // 上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '5mb',           // 最大文件体积限制
                    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: true,                   // 开启可拖曳上传
                    drop_element: container,        // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                // 分块上传时，每片的体积
                    resize: {
                        crop: false,
                        quality: 60,
                        preserve_headers: false
                    },
                    auto_start: false,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    filters: {
                        max_file_size: '5mb',
                        prevent_duplicates: true,
                        mime_types: [
                            // { title: 'Image files', extensions: 'jpg,jpeg,gif,png' },  // 限定jpg,gif,png后缀上传
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
                    /*x_vals: {
                      'groupid': 1
                    },*/
                    init: {
                        'FilesAdded': function (up, files) {
                            self._cookiesService.clearBeforeRefreshRoute();

                            plupload.each(files, function (file) {
                                // 上传之前本地预览
                                self.showCropArea();
                                for (let i = 0; i < files.length; i++) {
                                    const fileItem = files[i].getNative(),
                                        url = window.URL;
                                    const src = url.createObjectURL(fileItem);

                                    self._$cropImg.attr('src', src);
                                    self._$cropImg.cropper({
                                        dragMode: 'move',
                                        viewMode: 2,
                                        aspectRatio: self.cropScaleX / self.cropScaleY,
                                        crop: function (e) {
                                            const cropValue = `!${e.width >> 0}x${e.height >> 0}a${e.x >> 0}a${e.y >> 0}`;
                                            self.imageMogr2Link = Q1.imageMogr2({
                                                'auto-orient': true,  // 布尔值，是否根据原图EXIF信息自动旋正，便于后续处理，建议放在首位。
                                                strip: false,   // 布尔值，是否去除图片中的元信息
                                                // thumbnail: '1000x1000',   // 缩放操作参数
                                                crop: cropValue,  // 裁剪操作参数
                                                gravity: 'NorthWest',    // 裁剪锚点参数
                                                // quality: 65,  // 图片质量，取值范围1-100
                                                // rotate: 20,   // 旋转角度，取值范围1-360，缺省为不旋转。
                                                // format: 'jpg',// 新图的输出格式，取值范围：jpg，gif，png，webp等
                                                // blur: '3x5'    // 高斯模糊参数
                                            });
                                        }
                                    });
                                }
                            });
                        },
                        'BeforeUpload': function (up, file) {
                            // 每个文件上传前,处理相关的事情
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                            self.uploading = true;
                        },
                        'FileUploaded': function (up, file, info) {
                            // 每个文件上传成功后,处理相关的事情
                            const res = JSON.parse(info).result;
                            const currentPicUrl = res.originalUrl;
                            const currentPicId = res.pictureId;
                            self.uploadPictureInfo.pictureUrl = currentPicUrl;
                            self.uploadPictureInfo.pictureId = currentPicId;

                            self.picUploadInfoHandler.emit(self.uploadPictureInfo);
                            self.uploading = false;
                            self.hideCropArea();
                        },
                        'Error': function (up, err, errTip) {
                            // 上传出错时,处理相关的事情
                            self.uploading = false;
                            self.hideCropArea();
                            self.notify.error(this.l('Upload.Failed'));
                        },
                        'UploadComplete': function () {
                            // uploader.destroy();
                            // 队列文件处理完毕后,处理相关的事情
                        },
                        'Key': (up, file) => {
                            const id = this._appSessionService.tenantId;
                            const groupId = this.groupId;
                            const date = new Date();
                            const timeStamp = date.getTime().valueOf();
                            const key = `${id}/${groupId}/${timeStamp}`;

                            return key
                        }
                    }
                });
                $('#confirmUpload' + self.uploadUid).on('click', () => {
                    uploader.start();
                })
            });
    }

    saveCurrentUrl() {
        this._cookiesService.setBeforeRefreshRoute(this._router.routerState.snapshot.url);
    }

    cropClear(): void {
        this._$cropImg.removeAttr('src');
        this._$cropImg.cropper("destroy");
    }

    showCropArea(): void {
        this.isShowCropArea = true;
    }
    hideCropArea(): void {
        this.isShowCropArea = false;
        this.cropClear();
    }
}