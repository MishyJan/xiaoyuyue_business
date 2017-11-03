import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { AppSessionService } from 'shared/common/session/app-session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';

@Directive({
    selector: '[UploadPicture]'
})
export class UploadPicDirective implements AfterViewInit {
    uploadingIconClass: string;
    _$uploadingIconEle: JQuery<HTMLElement>;
    _$uploadingTextEle: JQuery<HTMLElement>;
    _$browseButtonEle: JQuery<HTMLElement>;
    _$uploadPicWrap: JQuery<HTMLElement>;

    public uploadPictureInfo: UploadPictureDto = new UploadPictureDto();

    @Input() browseButtonEle = '';
    @Input() groupId: number = 0;
    @Input() dropEle: string;
    @Input() containerEle = '';
    @Output() picUploadInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();

    constructor(
        private _element: ElementRef,
        private _sanitizer: DomSanitizer,
        private _appSessionService: AppSessionService,
        private _pictureServiceProxy: PictureServiceProxy
    ) {
    }

    ngAfterViewInit(): void {
        this._$uploadPicWrap = $(this._element.nativeElement);
        this._$browseButtonEle = this._$uploadPicWrap.find(this.browseButtonEle);
        this._$uploadingTextEle = this._$uploadPicWrap.find('.text');
        this._$uploadingIconEle = this._$uploadPicWrap.find('.icon');

        this.initFileUploader();
    }

    refreshState(isBusy: boolean): void {
        if (isBusy) {
            this.uploadingIconClass = this._$uploadingIconEle[0].className;
            this._$uploadingIconEle.removeClass();
            this._$uploadingIconEle.addClass('fa fa-spin fa-spinner');
            this._$uploadingTextEle.text('上传中...');
        } else {
            this._$uploadingTextEle.text('');
            this._$uploadingIconEle.removeClass();
            this._$uploadingIconEle.addClass('icon vapps-icon-cb-add-img');
        }
    }

    initFileUploader(): void {
        const self = this;

        let token = '';
        this._pictureServiceProxy
            .getPictureUploadToken()
            .subscribe(result => {
                token = result.token;

                // 引入Plupload 、qiniu.js后
                // var Q1 = new QiniuJsSDK();

                const uploader = new QiniuJsSDK().uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: self.browseButtonEle.slice(1),       // 上传选择的点选按钮，**必需**
                    // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'https://image.xiaoyuyue.com/',   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    container: self.containerEle.slice(1),           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '4mb',           // 最大文件体积限制
                    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: true,                   // 开启可拖曳上传
                    drop_element: self.browseButtonEle.slice(1),        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                // 分块上传时，每片的体积
                    resize: {
                        crop: false,
                        quality: 60,
                        preserve_headers: false
                    },
                    auto_start: true,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
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
                    /*x_vals: {
                      'groupid': 1
                    },*/
                    init: {
                        'FilesAdded': function (up, files) {
                            self.refreshState(true);
                        },
                        'BeforeUpload': function (up, file) {
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
                            self.uploadPictureInfo.pictureUrl = self.uploadPictureInfo.pictureUrl.changingThisBreaksApplicationSecurity;
                            self.uploadPictureInfo.pictureId = currentPicId;

                            self.picUploadInfoHandler.emit(self.uploadPictureInfo);
                            self.refreshState(false);
                            // self.close();
                        },
                        'Error': function (up, err, errTip) {
                            // 上传出错时,处理相关的事情
                            self.refreshState(false);
                            // self.notify.error('上传失败，请重新上传');
                        },
                        'UploadComplete': function () {
                            // uploader.destroy();
                            // 队列文件处理完毕后,处理相关的事情
                        },
                        'Key': (up, file) => {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            const id = this._appSessionService.tenantId;
                            const groupId = this.groupId;
                            const date = new Date();
                            const timeStamp = date.getTime().valueOf();
                            const key = `${id}/${groupId}/${timeStamp}`;
                            // do something with key here

                            return key
                        }
                    }
                });
                // $('#confirmUpload' + self.uploadUid).on('click', function () {
                //     uploader.start();
                // });
                // // 销毁实例
                // $('#cancelUpload' + self.uploadUid).on('click', function () {
                //     uploader.destroy();
                // });
            });
    }
}