import { BookingEditDto, BookingItemEditDto, BookingPictureEditDto, CreateOrUpdateBookingInput, GetBookingForEditOutput, OrgBookingServiceProxy, OutletServiceServiceProxy, PagedResultDtoOfBookingListDto, PictureServiceProxy, SelectListItemDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation, appModuleSlowAnimation } from 'shared/animations/routerTransition';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { Location } from '@angular/common';
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { ShareBookingModelComponent } from './share-booking-model/share-booking-model.component';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/sort-descriptor';

@Component({
    selector: 'app-create-or-edit-booking',
    templateUrl: './create-or-edit-booking.component.html',
    styleUrls: ['./create-or-edit-booking.component.less'],
    animations: [appModuleSlowAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class CreateOrEditBookingComponent extends AppComponentBase implements OnInit {
    tenantInfo: TenantInfoEditDto = new TenantInfoEditDto();
    // 传给图片管理组件
    pictureInfo: BookingPictureEditDto[];

    allPictureForEdit: BookingPictureEditDto[];
    outletSelectListData: SelectListItemDto[];
    contactorSelectListData: SelectListItemDto[];

    formVaild: boolean;
    allBookingTime: BookingItemEditDto[];
    infoFormValid: boolean;
    bookingDataForEdit: GetBookingForEditOutput;
    baseInfo: BookingEditDto = new BookingEditDto();
    timeInfo: BookingItemEditDto[];

    href: string = document.location.href;
    bookingId: any = +this.href.substr(this.href.lastIndexOf('/') + 1, this.href.length);

    input: CreateOrUpdateBookingInput = new CreateOrUpdateBookingInput();

    selectOutletId: number;
    selectContactorId: number;
    saving = false;
    savingAndEditing = false;
    //   是否显示完善机构信息弹窗
    isShowImperfectTip = false;

    @ViewChild('shareBookingModel') shareBookingModel: ShareBookingModelComponent;

    public outletSelectDefaultItem: string;
    public contactorSelectDefaultItem: string;
    constructor(
        injector: Injector,
        private _locaition: Location,
        private _router: Router,
        private _pictureServiceProxy: PictureServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _organizationBookingServiceProxy: OrgBookingServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.initFileUploader();
        this.loadData();
        this.getTenantInfo();
    }

    /**
    * desktop
    */
    back() {
        // this._locaition.back();
        this._router.navigate(['/booking'])
    }

    /**
     * data
     */
    // 获取机构信息是否完善
    getTenantInfo(): void {
        this._tenantInfoServiceProxy
            .getTenantInfoForEdit()
            .subscribe(result => {
                if (!(result.backgroundPictureUrl && result.logoUrl && result.tagline && result.description)) {
                    this.isShowImperfectTip = true;
                    return;
                }
                this.isShowImperfectTip = false;
            });
    }

    loadData() {
        if (!this.bookingId) {
            // 获取门店下拉框数据源
            this._outletServiceServiceProxy
                .getOutletSelectList()
                .subscribe(result => {
                    this.outletSelectDefaultItem = result[0].value;
                    this.selectOutletId = +result[0].value;
                    this.outletSelectListData = result;

                    // 获取联系人下拉框数据源
                    this._outletServiceServiceProxy
                        .getContactorSelectList(this.selectOutletId)
                        .subscribe(result => {
                            this.contactorSelectDefaultItem = result[0].value;
                            this.selectContactorId = parseInt(result[0].value);
                            this.contactorSelectListData = result;
                        })
                })
            return;
        }

        this._organizationBookingServiceProxy
            .getBookingForEdit(this.bookingId)
            .subscribe(result => {
                this.bookingDataForEdit = result;
                this.baseInfo = result.booking;
                this.timeInfo = result.items;
                this.pictureInfo = result.bookingPictures;

                // 获取门店下拉框数据源
                this._outletServiceServiceProxy
                    .getOutletSelectList()
                    .subscribe(result => {
                        this.outletSelectDefaultItem = this.bookingDataForEdit.booking.outletId.toString();
                        this.outletSelectListData = result;
                        this.selectOutletId = +result[0].value;

                        // 获取联系人下拉框数据源
                        this._outletServiceServiceProxy
                            .getContactorSelectList(this.bookingDataForEdit.booking.outletId)
                            .subscribe(result => {
                                this.contactorSelectListData = result;
                                this.contactorSelectDefaultItem = result[0].value;
                                this.selectContactorId = +result[0].value;
                            })
                    })
            })
    }

    save() {
        this.input.booking.id = this.bookingId ? this.bookingId : 0;
        this.input.booking = this.baseInfo;
        this.input.booking.outletId = this.selectOutletId;
        this.input.booking.contactorId = this.selectContactorId;
        this.input.booking.isActive = true;
        // 判断是否有添加新的时间信息
        this.input.items = !this.allBookingTime ? this.timeInfo : this.allBookingTime;
        // 判断是否上传过图片
        if (this.allPictureForEdit) {
            this.input.bookingPictures = this.allPictureForEdit;
        } else {
            this.input.bookingPictures = this.pictureInfo;
        }
        this.saving = true;
        this._organizationBookingServiceProxy
            .createOrUpdateBooking(this.input)
            .finally(() => { this.saving = false })
            .subscribe((result) => {
                this.shareBookingModel.show(result.id);
            });
    }

    saveAndEdit() {
        this.input.booking.id = this.bookingId ? this.bookingId : 0;
        this.input.booking = this.baseInfo;
        this.input.booking.outletId = this.selectOutletId;
        this.input.booking.contactorId = this.selectContactorId;
        this.input.booking.isActive = true;
        // 判断是否有添加新的时间信息
        this.input.items = !this.allBookingTime ? this.timeInfo : this.allBookingTime;
        // 判断是否上传过图片
        if (this.allPictureForEdit) {
            this.input.bookingPictures = this.allPictureForEdit;
        } else {
            this.input.bookingPictures = this.pictureInfo;
        }
        this._organizationBookingServiceProxy
            .createOrUpdateBooking(this.input)
            .finally(() => { this.savingAndEditing = false })
            .subscribe((result) => {
                this.notify.success('保存成功!');
                this.bookingId = result.id;
                this.loadData();
            });
    }

    // 表单验证
    // bookingFormVaild(): boolean {
    //   this.formVaild = !this.infoFormValid || !(this.baseInfo.name || this.baseInfo.description);
    //   return this.formVaild;
    // }

    getTimeInfoInput(allBookingTime: BookingItemEditDto[]) {
        this.allBookingTime = allBookingTime;
    }

    getInfoFormValid(infoFormValid: boolean) {
        this.infoFormValid = infoFormValid;
    }

    public outletChange(outlet: any): void {
        this.selectOutletId = parseInt(outlet);
        this._outletServiceServiceProxy
            .getContactorSelectList(this.selectOutletId)
            .subscribe(result => {
                this.contactorSelectListData = result;
                this.contactorSelectDefaultItem = result[0].value;
                this.selectContactorId = +result[0].value;
            })
    }

    public contactorChange(contactor: any): void {
        this.selectContactorId = parseInt(contactor);
    }

    getAllPictureForEdit(pictureForEdit: BookingPictureEditDto[]) {
        this.allPictureForEdit = pictureForEdit;
    }

    // 移动端代码
    initFileUploader(): void {
        const self = this;
        // this._$profilePicture = $('#profilePicture' + this.uploadUid);

        let token = '';
        this._pictureServiceProxy
            .getPictureUploadToken()
            .subscribe(result => {
                token = result.token;
                // self._$profilePicture = $('#profilePicture' + self.uploadUid);

                // 引入Plupload 、qiniu.js后
                // var Q1 = new QiniuJsSDK();
                const uploader = new QiniuJsSDK().uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: 'uploadArea',       // 上传选择的点选按钮，**必需**
                    // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'http://image.xiaoyuyue.com/',   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    // container: 'uploadAreaWrap'+self.uploadUid,           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '4mb',           // 最大文件体积限制
                    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: false,                   // 开启可拖曳上传
                    // drop_element: 'dropArea'+self.uploadUid,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
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
                        'FilesAdded': function (up, files) {
                            plupload.each(files, function (file) {
                                // 文件添加进队列后,处理相关的事情

                                // 上传之前本地预览
                                for (let i = 0; i < files.length; i++) {
                                    const fileItem = files[i].getNative(),
                                        url = window.URL;
                                    const src = url.createObjectURL(fileItem);
                                    // self._$profilePicture.attr('src', src);
                                    // self._$profilePicture.attr('width', '100%');
                                }
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
                            // 其中 info 是文件上传成功后，服务端返回的json，形式如
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                            const res = JSON.parse(info).result;
                            const currentPicUrl = res.originalUrl;
                            const currentPicId = res.pictureId;
                            // self.uploadPictureInfo.pictureUrl = self._sanitizer.bypassSecurityTrustResourceUrl(currentPicUrl);
                            // self.uploadPictureInfo.pictureId = currentPicId;
                            // self.picUploadInfoHandler.emit(self.uploadPictureInfo);
                            // self.loading = false;
                            // self.close();
                        },
                        'Error': function (up, err, errTip) {
                            // 上传出错时,处理相关的事情
                            // self.loading = false;
                            self.notify.error('上传失败，请重新上传');
                        },
                        'UploadComplete': function () {
                            uploader.destroy();
                            // 队列文件处理完毕后,处理相关的事情
                        },
                        'Key': function (up, file) {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            const id = 1;
                            const outletId = 3;
                            const date = new Date();
                            const timeStamp = date.getTime().valueOf();
                            const key = `${id}/${outletId}/${timeStamp}`;
                            // do something with key here

                            const domain = up.getOption('domain');
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

    // PC端代码

    // 业务代码
}
