import { Component, OnInit, Output, EventEmitter, Injector, Input, SimpleChanges } from '@angular/core';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DomSanitizer } from '@angular/platform-browser';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
    selector: 'xiaoyuyue-mobile-upload-picture',
    templateUrl: './mobile-upload-picture.component.html',
    styleUrls: ['./mobile-upload-picture.component.scss']
})
export class MobileUploadPictureComponent extends AppComponentBase implements OnInit {

    uploadPictureInfo: UploadPictureDto = new UploadPictureDto();
    uploadUid: number = Math.round(new Date().valueOf() * Math.random());
    tempUrl: string;

    @Input() width: string = '100%';
    @Input() height: string = '100%';
    @Input() groupId: string = '1';
    @Input() slogan: string;
    @Input() existedPicUrl: string;
    @Output() picUploadInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();

    constructor(
        private injector: Injector,
        private _sanitizer: DomSanitizer,
        private _pictureServiceProxy: PictureServiceProxy
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

        let token = '';
        this._pictureServiceProxy
            .getPictureUploadToken()
            .subscribe(result => {
                token = result.token;

                // 引入Plupload 、qiniu.js后
                // var Q1 = new QiniuJsSDK();

                const uploader = new QiniuJsSDK().uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: browse_button,       // 上传选择的点选按钮，**必需**
                    // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'http://image.xiaoyuyue.com/',   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    container: container,           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '4mb',           // 最大文件体积限制
                    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: true,                   // 开启可拖曳上传
                    drop_element: container,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                // 分块上传时，每片的体积
                    resize: {
                        crop: false,
                        quality: 60,
                        preserve_headers: false
                    },
                    auto_start: true,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
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
                            plupload.each(files, function (file) {
                                // 上传之前本地预览
                                // for (let i = 0; i < files.length; i++) {
                                //     const fileItem = files[i].getNative(),
                                //         url = window.URL;
                                //     self.tempUrl = url.createObjectURL(fileItem);
                                // }
                            });
                        },
                        'BeforeUpload': function (up, file) {
                            // 每个文件上传前,处理相关的事情
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                            // self.loading = true;
                        },
                        'FileUploaded': function (up, file, info) {
                            // 每个文件上传成功后,处理相关的事情
                            const res = JSON.parse(info).result;
                            const currentPicUrl = res.originalUrl;
                            const currentPicId = res.pictureId;
                            self.uploadPictureInfo.pictureUrl = self._sanitizer.bypassSecurityTrustResourceUrl(currentPicUrl);
                            self.uploadPictureInfo.pictureUrl = self.uploadPictureInfo.pictureUrl.changingThisBreaksApplicationSecurity;
                            self.uploadPictureInfo.pictureId = currentPicId;

                            self.picUploadInfoHandler.emit(self.uploadPictureInfo);
                            // self.loading = false;
                            // self.close();
                        },
                        'Error': function (up, err, errTip) {
                            // 上传出错时,处理相关的事情
                            // self.loading = false;
                            // self.notify.error('上传失败，请重新上传');
                        },
                        'UploadComplete': function () {
                            // uploader.destroy();
                            // 队列文件处理完毕后,处理相关的事情
                        },
                        'Key': function (up, file) {
                            const id = 1;
                            const outletId = 3;
                            const date = new Date();
                            const timeStamp = date.getTime().valueOf();
                            const key = `${id}/${outletId}/${timeStamp}`;

                            const domain = up.getOption('domain');
                            return key
                        }
                    }
                });
            });
    }
}