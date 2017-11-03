import '@node_modules/qiniu-js/dist/qiniu.min';

import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { ModalDirective } from 'ngx-bootstrap';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';

@Component({
    selector: 'xiaoyuyue-upload-picture-none-gallery',
    templateUrl: './upload-picture-none-gallery.component.html',
    styleUrls: ['./upload-picture-none-gallery.component.scss']
})


export class UploadPictureNoneGalleryComponent extends AppComponentBase implements OnInit {

    loading = false;
    private _$profilePicture: JQuery;

    public uploadPictureInfo: UploadPictureDto = new UploadPictureDto();

    @Output() picUploadInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
    @Input() uploadUid: number;
    @Input() groupId: number = 0;
    @ViewChild('uploadPictureNoneGalleryModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _pictureServiceProxy: PictureServiceProxy,
        private _appSessionService: AppSessionService,
        private _sanitizer: DomSanitizer
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
    }

    show(): void {
        this.modal.show();
        this.initFileUploader();
    }
    close(): void {
        this.modal.hide();
        this.picturyDestroy();
    }

    picturyDestroy(): void {
        this.uploadPictureInfo = new UploadPictureDto();
        this._$profilePicture.css({
            'background-image': 'url("")'
        })
    }

    initFileUploader(): void {
        const self = this;
        this._$profilePicture = $('#profilePicture' + this.uploadUid);

        let token = '';
        this._pictureServiceProxy
            .getPictureUploadToken()
            .subscribe(result => {
                token = result.token;
                self._$profilePicture = $('#profilePicture' + self.uploadUid);

                // 引入Plupload 、qiniu.js后
                // var Q1 = new QiniuJsSDK();
                const uploader = new QiniuJsSDK().uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: 'uploadArea' + self.uploadUid,       // 上传选择的点选按钮，**必需**
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    domain: 'http://image.xiaoyuyue.com/',   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    max_file_size: '4mb',           // 最大文件体积限制
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: false,                   // 开启可拖曳上传
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
                            { title: 'Image files', extensions: 'jpg,gif,png' },  // 限定jpg,gif,png后缀上传
                        ]
                    },
                    x_vars: {
                        groupid: function (up, file) {
                            return self.groupId;
                        }
                    },
                    init: {
                        'FilesAdded': function (up, files) {
                            plupload.each(files, function (file) {
                                // 文件添加进队列后,处理相关的事情
                                // 上传之前本地预览
                                for (let i = 0; i < files.length; i++) {
                                    const fileItem = files[i].getNative(),
                                        url = window.URL;
                                    const src = url.createObjectURL(fileItem);
                                    self._$profilePicture.css({
                                        'background-image': 'url(' + src + ')'
                                    })
                                }
                            });
                        },
                        'BeforeUpload': function (up, file) {
                            self.loading = true;
                            // 每个文件上传前,处理相关的事情
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                        },
                        'FileUploaded': function (up, file, info) {
                            const res = JSON.parse(info).result;
                            const currentPicUrl = res.originalUrl;
                            const currentPicId = res.pictureId;
                            self.uploadPictureInfo.pictureUrl = self._sanitizer.bypassSecurityTrustResourceUrl(currentPicUrl);
                            self.uploadPictureInfo.pictureId = currentPicId;
                            self.picUploadInfoHandler.emit(self.uploadPictureInfo);
                            self.loading = false;
                            self.close();
                        },
                        'Error': function (up, err, errTip) {
                            // 上传出错时,处理相关的事情
                            self.loading = false;
                            self.notify.error('上传失败，请重新上传');
                        },
                        'UploadComplete': function () {
                            uploader.destroy();
                            self.picturyDestroy();
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
                $('#confirmUpload' + self.uploadUid).on('click', function () {
                    uploader.start();
                });

                $('#cancelUpload' + self.uploadUid).on('click', () => {
                    uploader.destroy();
                    this.picturyDestroy();
                });
            });
    }

}
