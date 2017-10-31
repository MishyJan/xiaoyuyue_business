import * as wangEditor from 'wangeditor/release/wangEditor.js'

import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

import { AbpSessionService } from '@abp/session/abp-session.service';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { UploadPictureService } from 'shared/services/upload-picture.service';

var Base64 = require('js-base64').Base64;

@Directive({
  selector: '[WangEditor]'
})
export class WangEditorDirective implements AfterViewInit {

  private editor: any;
  private editorHtml: string;
  _self = this;
  constructor(private _element: ElementRef,
    private _sessionService: AbpSessionService,
    private _pictureServiceProxy: PictureServiceProxy,
    private _uploadPictureService: UploadPictureService) {

  }
  ngAfterViewInit(): void {
    this.initEditor();
  }

  initEditor() {
    const editordom = this._element.nativeElement;
    this.editor = new wangEditor(editordom)

    this.editor.customConfig.uploadImgShowBase64 = true;
    this.editor.customConfig.zIndex = 100;
    this.editor.customConfig.onchange = (html) => {
      this.editorOnChange(html);
    };

    // 允许上传到七牛云存储
    this.editor.customConfig.qiniu = true
    this.editor.customConfig.menus = [
      'head',  // 标题
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
          // uptoken_url: '/uptoken',
          // Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
          uptoken: result,
          // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
          // unique_names: true,
          // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
          // save_key: true,
          // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
          domain: 'https://image.xiaoyuyue.com/',
          get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
          // bucket 域名，下载资源时用到，**必需**
          container: containerId,           // 上传区域DOM ID，默认是browser_button的父元素，
          max_file_size: '2mb',           // 最大文件体积限制
          // flash_swf_url: '../js/plupload/Moxie.swf',  // 引入flash,相对路径
          filters: {
            mime_types: [
              // 只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
              { title: '图片文件', extensions: 'jpg,gif,png,bmp' }
            ]
          },
          max_retries: 3,                   // 上传失败最大重试次数
          dragdrop: true,                   // 开启可拖曳上传
          drop_element: textElemId,        // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb',                // 分块上传时，每片的体积
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
              plupload.each(files, function (file) {
                // 文件添加进队列后,处理相关的事情
                self.printLog('on FilesAdded');
              });
            },
            'BeforeUpload': function (up, file) {
              // 每个文件上传前,处理相关的事情
              self.printLog('on BeforeUpload');
            },
            'UploadProgress': function (up, file) {
              // 显示进度
              self.printLog('进度 ' + file.percent)
            },
            'FileUploaded': function (up, file, info) {
              self.printLog(info);
              const res = JSON.parse(info).result;
              const currentPicUrl = res.originalUrl;
              // 插入图片到editor
              self.editor.cmd.do('insertHtml', '<img src="' + currentPicUrl + '" style="max-width:100%;"/>')
            },
            'Error': function (up, err, errTip) {
              // 上传出错时,处理相关的事情
              self.printLog('on Error');
            },
            'UploadComplete': function () {
              // 队列文件处理完毕后,处理相关的事情
              self.printLog('on UploadComplete');
            }
            // Key 函数如果有需要自行配置，无特殊需要请注释
            ,
            'Key': (up, file) => {
              // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
              // 该配置必须要在 unique_names: false , save_key: false 时才生效
              const key = self.getFileKey();
              return self.getFileKey()
            }
          }
          // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
          // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
        });
      });
  }

  // 封装 console.log 函数
  printLog(title) {
    window.console && console.log(title);
  }

  /*picBase是base64图片带头部的完整编码*/
  putb642Qiniu(picBase, upToken) {
    /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
    const picBaseWithOutHeader = picBase.substring(22);
    /*通过base64编码字符流计算文件流大小函数*/
    function fileSize(str) {
      let fileSize;
      if (str.indexOf('=') > 0) {
        const indexOf = str.indexOf('=');
        str = str.substring(0, indexOf); // 把末尾的’=‘号去掉
      }

      fileSize = parseInt((str.length - (str.length / 8) * 2).toString(), 0);
      return fileSize;
    }

    /*把字符串转换成json*/
    function strToJson(str) {
      const json = eval('(' + str + ')');
      return json;
    }

    const url = 'http://up-z2.qiniu.com/putb64/' + fileSize(picBaseWithOutHeader);
    const key = '/key/' + Base64.encode(this.getFileKey());
    const x_vars = '/x:groupid/' + Base64.encode('0');
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const result = strToJson(xhr.responseText).result;
        const html = this.editor.txt.html();
        this.editorHtml = html.replace(picBase, result.originalUrl)
        // 替换图片
        // this.editor.txt.html(this.editorHtml);
      }
    }

    xhr.open('POST', url + key + x_vars, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('Authorization', 'UpToken ' + upToken);
    xhr.send(picBaseWithOutHeader);
  }

  editorOnChange(html) {
    // 1，匹配出图片img标签（即匹配出所有图片），过滤其他不需要的字符
    // 2.从匹配出来的结果（img标签中）循环匹配出图片地址（即src属性）
    // 匹配图片（g表示匹配所有结果i表示区分大小写）
    const imgReg = /<img.*?(?:>|\/>)/gi;
    // 匹配src属性
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    // 检测base
    const reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
    const arr = html.match(imgReg);
    for (let i = 0; i < arr.length; i++) {
      const src = arr[i].match(srcReg);
      // 检查图片路径是否是base64
      if (reg.test(src[1])) {
        this._uploadPictureService.getPictureUploadToken()
          .then((token) => {
            this.putb642Qiniu(src[1], token);
          });
      }
    }

  }

  getFileKey(): string {
    const id = this._sessionService.tenantId;;
    const groupId = 0;
    const date = new Date();
    const timeStamp = date.getTime().valueOf();
    const key = `${id}/${groupId}/${timeStamp}`;
    return key;
  }
}
