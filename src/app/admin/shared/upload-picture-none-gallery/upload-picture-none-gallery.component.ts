import { Component, OnInit, Injector, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { UploadPictureDto } from "app/admin/shared/utils/upload-picture.dto";

@Component({
  selector: 'xiaoyuyue-upload-picture-none-gallery',
  templateUrl: './upload-picture-none-gallery.component.html',
  styleUrls: ['./upload-picture-none-gallery.component.scss']
})


export class UploadPictureNoneGalleryComponent extends AppComponentBase implements OnInit {

  private _$profilePicture: JQuery;

  public temporaryPictureUrl: string;
  public uploadPictureInfo: UploadPictureDto = new UploadPictureDto();

  // BSModel唯一标识
  @Input() uniqueUid: string;

  @Output() picUploadInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
  @ViewChild('uploadPictureNoneGalleryModel') modal: ModalDirective;

  constructor(
    injector: Injector,
    private _pictureServiceProxy: PictureServiceProxy,
    private _sanitizer: DomSanitizer
  ) {
    super(
      injector
    );
  }

  ngOnInit() {
    this.initFileUploader();
  }

  show(): void {
    this.modal.show();
  }
  close(): void {
    this.modal.hide();
  }

  initFileUploader(): void {
    let self = this;
    this._$profilePicture = $('#profilePicture'+this.uniqueUid);
    this.temporaryPictureUrl = "";

    let token: string = '';
    this._pictureServiceProxy
      .getPictureUploadToken()
      .subscribe(result => {
        token = result.token;
        self._$profilePicture = $('#profilePicture'+this.uniqueUid);

        //引入Plupload 、qiniu.js后
        var Q1 = new QiniuJsSDK();
        var uploader = Q1.uploader({
          runtimes: 'html5,flash,html4',    //上传模式,依次退化
          browse_button: 'pictureGalleryPickfiles' + self.uniqueUid,       //上传选择的点选按钮，**必需**
          // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
          uptoken: token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
          // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
          // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
          domain: 'http://image.xiaoyuyue.com/',   //bucket 域名，下载资源时用到，**必需**
          get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
          container: 'pictureGallery' + self.uniqueUid,           //上传区域DOM ID，默认是browser_button的父元素，
          max_file_size: '10mb',           //最大文件体积限制
          // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
          max_retries: 0,                   //上传失败最大重试次数
          dragdrop: true,                   //开启可拖曳上传
          drop_element: 'pictureGallery' + self.uniqueUid,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
          chunk_size: '4mb',                //分块上传时，每片的体积
          auto_start: false,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
          x_vars: {
            groupid: function (up, file) {
              return 1;
            }
          },
          /*x_vals: {
            'groupid': 1
          },*/
          init: {
            'FilesAdded': function (up, files) {
              plupload.each(files, function (file) {
                // 文件添加进队列后,处理相关的事情

                // 上传之前本地预览
                for (var i = 0; i < files.length; i++) {
                  var fileItem = files[i].getNative(),
                    url = window.URL;
                  var src = url.createObjectURL(fileItem);
                  self.temporaryPictureUrl = src;
                  self._$profilePicture.attr("src", self.temporaryPictureUrl);
                  self._$profilePicture.attr("width", "100%");
                }
                console.log('加入上传');
              });
            },
            'BeforeUpload': function (up, file) {
              // 每个文件上传前,处理相关的事情
              console.log('上传之前');
              self.modal.hide();
            },
            'UploadProgress': function (up, file) {
              // 每个文件上传时,处理相关的事情
              console.log('正在上传');
            },
            'FileUploaded': function (up, file, info) {
              // 每个文件上传成功后,处理相关的事情
              // 其中 info 是文件上传成功后，服务端返回的json，形式如
              // {
              //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
              //    "key": "gogopher.jpg"
              //  }
              // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html


              var res = JSON.parse(info).result;
              var currentPicUrl = res.originalUrl;
              var currentPicId = res.pictureId;
              self.uploadPictureInfo.pictureUrl = self._sanitizer.bypassSecurityTrustResourceUrl(currentPicUrl);
              self.uploadPictureInfo.pictureId = currentPicId;
              self.picUploadInfoHandler.emit(self.uploadPictureInfo);
              console.log("上传成功");
            },
            'Error': function (up, err, errTip) {
              //上传出错时,处理相关的事情
              console.log('上传出错');
            },
            'UploadComplete': function () {
              //队列文件处理完毕后,处理相关的事情
              console.log('完成流程');
            },
            'Key': function (up, file) {
              // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
              // 该配置必须要在 unique_names: false , save_key: false 时才生效
              let id = 1;
              let outletId = 3;
              let date = new Date();
              let timeStamp = date.getTime().valueOf();
              let key = `${id}/${outletId}/${timeStamp}`;
              // do something with key here

              var domain = up.getOption('domain');
              return key
            }
          }
        });
        $('#confirmUpload'+self.uniqueUid).on("click", function () {
          uploader.start();
        })
      });
  }

}