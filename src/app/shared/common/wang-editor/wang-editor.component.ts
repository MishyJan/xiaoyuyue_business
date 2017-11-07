import * as _ from 'lodash';
import * as wangEditor from 'wangeditor/release/wangEditor.js'

import { AfterViewInit, Component, Directive, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { AbpSessionService } from '@abp/session/abp-session.service';
import { LanguageServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { UploadPictureService } from 'shared/services/upload-picture.service';

const Base64 = require('js-base64').Base64;

@Component({
    selector: 'xiaoyuyue-wang-editor',
    template: `<div></div>`
})

export class WangEditorComponent implements AfterViewInit, OnChanges {

    private editor: any;
    private transformHtml: string;

    private oldpictures: PictureEditDto[] = [];
    private newpictures: PictureEditDto[] = [];

    @Input() baseInfoDesc: string;
    @Output() sendEditorHTMLContent: EventEmitter<string> = new EventEmitter();

    constructor(private _element: ElementRef,
        private _sessionService: AbpSessionService,
        private _pictureServiceProxy: PictureServiceProxy,
        private _uploadPictureService: UploadPictureService) {

    }
    ngAfterViewInit(): void {
        this.initEditor();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.baseInfoDesc) {
            this.editor.txt.html(this.baseInfoDesc);
            this.editorOnChange(this.baseInfoDesc);
        }
    }

    public save() {
        this.editorOnChange(this.editor.txt.html());
    }

    initEditor() {
        const editordom = this._element.nativeElement.querySelector('div');
        this.editor = new wangEditor(editordom)

        this.editor.customConfig.uploadImgShowBase64 = true;
        this.editor.customConfig.zIndex = 100;
        this.editor.customConfig.onchangeTimeout = 500 // 单位 ms
        this.editor.customConfig.onchange = (html) => {
            // this.editorOnChange(html, false);
            // this.sendEditorHTMLContent.emit(this.editorHtml);
        };

        // 允许上传到七牛云存储
        this.editor.customConfig.qiniu = true
        this.editor.customConfig.menus = [
            'bold',  // 粗体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'link',  // 插入链接
            'justify',  // 对齐方式
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
        ];
        this.editor.create();
        this.uploaddInit();
    }

    editorOnChange(html: string) {
        this.transformHtml = html;
        // 1，匹配出图片img标签（即匹配出所有图片），过滤其他不需要的字符
        // 2.从匹配出来的结果（img标签中）循环匹配出图片地址（即src属性）
        // 匹配图片（g表示匹配所有结果i表示区分大小写）
        const imgReg = /<img.*?(?:>|\/>)/gi;
        const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配src属性
        const reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;  // 检测base
        const arr = html.match(imgReg);
        if (arr === null) {
            if (this.oldpictures.length <= 0) {
                this.sendEditorHTMLContent.emit(this.transformHtml);
                return;
            }
        } else {
            // 扫描所有image标签
            this.scanPicture(arr);
        }

        if (this.oldpictures.length > 0) {
            // 执行删除
            this.clearPicture();
        } else {
            // 首次加载内容
            this.oldpictures = this.newpictures;
            this.newpictures = [];
        }
        this.sendEditorHTMLContent.emit(this.transformHtml);
    }

    // 初始化七牛上传的方法
    uploaddInit() {
        // 获取相关 DOM 节点的 ID
        const btnId = this.editor.imgMenuId;
        const containerId = this.editor.toolbarElemId;
        const textElemId = this.editor.textElemId;
        const self = this;

        this._uploadPictureService.getPictureUploadToken()
            .then((result) => {
                // 创建上传对象
                const uploader = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: btnId,       // 上传选择的点选按钮，**必需**
                    uptoken: result,
                    domain: 'https://image.xiaoyuyue.com/',
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    container: containerId,           // 上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '2mb',           // 最大文件体积限制
                    filters: {
                        mime_types: [
                            // 只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
                            { title: '图片文件', extensions: 'jpg,gif,png,bmp' }
                        ]
                    },
                    max_retries: 3,                   // 上传失败最大重试次数
                    dragdrop: true,                   // 开启可拖曳上传
                    drop_element: textElemId,        // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '2mb',                // 分块上传时，每片的体积
                    // resize: {
                    //   crop: false,
                    //   quality: 60,
                    //   preserve_headers: false
                    // },
                    auto_start: true,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    x_vars: {
                        groupid: function (up, file) {
                            return 0;
                        }
                    },
                    init: {
                        'FilesAdded': function (up, files) {
                        },
                        'BeforeUpload': function (up, file) {
                        },
                        'UploadProgress': function (up, file) {
                        },
                        'FileUploaded': function (up, file, info) {
                            const res = JSON.parse(info).result;
                            const currentPicUrl = res.originalUrl;
                            // 插入图片到editor
                            self.editor.cmd.do('insertHtml', '<img src="' + currentPicUrl + '" style="max-width:100%;"/>')
                        },
                        'Error': function (up, err, errTip) {
                            // 上传出错时,处理相关的事情
                        },
                        'UploadComplete': function () {
                            // 队列文件处理完毕后,处理相关的事情
                        },
                        'Key': (up, file) => {
                            const key = self.getFileKey();
                            return self.getFileKey()
                        }
                    }
                });
            });
    }

    scanPicture(imageTags: string[]) {
        const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配src属性
        const reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;  // 检测base

        for (let i = 0; i < imageTags.length; i++) {
            const src = imageTags[i].match(srcReg);
            const pictureSrc = src[1];
            // 图片是否是base64
            if (reg.test(pictureSrc)) {
                let pic = this.getPictureByBase64(this.oldpictures, pictureSrc);
                if (!pic) { pic = this.replaceHtmlAndPutPic(pictureSrc); }
                // 当前编辑器的的图片
                this.newpictures.unshift(pic);
            } else if (!this.getPictureByUrl(this.newpictures, pictureSrc)) {
                // 当前编辑器的的图片
                this.newpictures.unshift(new PictureEditDto(null, pictureSrc));
            }
        }
    }

    replaceHtmlAndPutPic(picBase64: string): PictureEditDto {
        const key = this.getFileKey();
        const url = 'https://image.xiaoyuyue.com/' + key;
        const pic = new PictureEditDto(picBase64, url);
        // 替换html
        this.transformHtml = this.transformHtml.replace(picBase64, url);
        this.sendEditorHTMLContent.emit(this.transformHtml);
        // 上传图片
        this._uploadPictureService.getPictureUploadToken().then((token) => {
            this.putb642Qiniu(picBase64, token, key);
        });

        return pic;
    }

    /*picBase64是base64图片带头部的完整编码*/
    putb642Qiniu(picBase64: string, upToken: string, key: string) {
        /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
        const picBase64WithOutHeader = picBase64.substring(22);
        const url = 'https://upload-z2.qiniup.com/putb64/' + this.fileSize(picBase64WithOutHeader);
        const fileKey = '/key/' + Base64.encode(key);
        const x_vars = '/x:groupid/' + Base64.encode('0');
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                // const result = this.strToJson(xhr.responseText).result;
                // const html = this.editor.txt.html();

            }
        }

        xhr.open('POST', url + fileKey + x_vars, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Authorization', 'UpToken ' + upToken);
        xhr.send(picBase64WithOutHeader);
    }

    getFileKey(): string {
        const id = this._sessionService.tenantId;;
        const groupId = 0;
        const date = new Date();
        const timeStamp = date.getTime().valueOf();
        const key = `${id}/${groupId}/${timeStamp}`;
        return key;
    }

    clearPicture() {
        const picture2Delete: string[] = [];
        for (let i of this.oldpictures) {
            if (!this.getPictureByUrl(this.newpictures, i.url)) {
                picture2Delete.unshift(i.url);
            }
        }

        if (picture2Delete.length > 0) {
            this._pictureServiceProxy.deleteByUrlAsync(picture2Delete).subscribe(() => {
                this.oldpictures = this.newpictures;
                this.newpictures = [];
            });
        } else {
            this.newpictures = [];
        }
    }

    getPictureByUrl(pictures: PictureEditDto[], url: string): PictureEditDto {
        for (let picture of pictures) {
            if (picture.url === url) {
                return picture;
            }
        }
        return null;
    }

    getPictureByBase64(pictures: PictureEditDto[], base: string): PictureEditDto {
        for (let picture of pictures) {
            if (picture.picBase === base) {
                return picture;
            }
        }
        return null;
    }

    /*通过base64编码字符流计算文件流大小函数*/
    fileSize(str) {
        let size;
        if (str.indexOf('=') > 0) {
            const indexOf = str.indexOf('=');
            str = str.substring(0, indexOf); // 把末尾的’=‘号去掉
        }

        size = parseInt((str.length - (str.length / 8) * 2).toString(), 0);
        return size;
    }

    /*把字符串转换成json*/
    strToJson(str) {
        const json = eval('(' + str + ')');
        return json;
    }
}



class PictureEditDto {
    picBase: string;
    url: string;

    constructor(picBase, url) {
        this.picBase = picBase;
        this.url = url;
    }
}