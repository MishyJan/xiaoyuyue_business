import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ContactorEditDto, CreateOrUpdateOutletInput, OutletServiceServiceProxy } from 'shared/service-proxies/service-proxies';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'shared/common/app-component-base';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { UploadPictureNoneGalleryComponent } from 'app/shared/common/upload-picture-none-gallery/upload-picture-none-gallery.component';

@Component({
    selector: 'xiaoyuyue-contact-info',
    templateUrl: './contact-info.component.html',
    styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent extends AppComponentBase implements OnInit, AfterViewInit {
    groupId: number = DefaultUploadPictureGroundId.LinkmanGroup;
    outletId: number;
    uploadPicInfo: UploadPictureDto = new UploadPictureDto();
    currentIndex: number;
    contactName = '';
    editingContactor: ContactorEditDto = new ContactorEditDto(); // 保存本地数据单个联系人

    // 是否是新增，新增显示空数据；否则显示用户数据
    actionFlag: boolean[] = [];
    isCreateOutlet: boolean; // 是否创建门店
    isCreating = false;
    isEditing = false;

    @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
    @Output() contactorEditHandler: EventEmitter<ContactorEditDto[]> = new EventEmitter();
    @Input() existedContactors: ContactorEditDto[];

    constructor(
        injector: Injector,
        private _route: ActivatedRoute,
        private _outletServiceServiceProxy: OutletServiceServiceProxy
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this.outletId = +this._route.snapshot.paramMap.get('id');
        this.isCreateOutlet = !this.outletId;
        this.loadData();
        if (!this.outletId) {
            this.isCreating = true;
            return;
        }
    }

    ngAfterViewInit() {

    }

    loadData(): void {
    }

    save(): void {
        this.editingContactor.isDefault = this.editingContactor.isDefault || false;
        if (!this.isMobile($('.mobile-contact-info'))) {
            this.editingContactor.wechatQrcodeUrl = this.uploadPicInfo.pictureUrl.changingThisBreaksApplicationSecurity;
        } else {
            this.editingContactor.wechatQrcodeUrl = this.uploadPicInfo.pictureUrl;
        }
        if (this.isEditing) {
            this.editingContactor.wechatQrcodeUrl = this.uploadPicInfo.pictureUrl;
            this.insertContact(this.currentIndex, this.editingContactor);
            this.closeCreateContact();
            this.isEditing = false;
            return;
        }
        this.existedContactors.push(this.editingContactor);
        this.closeCreateContact();

        // 默认让第一个为选中状态
        if (this.existedContactors.length == 1) {
            this.existedContactors[0].isDefault = true;
        }

        this.contactorEditHandler.emit(this.existedContactors)
    }

    cancel(): void {
        if (this.isEditing) {
            this.save();
            return;
        }
        this.closeCreateContact();
    }

    // 打开创建面板
    openCreateContact(): void {
        this.isCreating = true;
        this.contactName = '';
        this.uploadPicInfo.pictureUrl = '';
    }

    // 关闭创建面板
    closeCreateContact(): void {
        this.isCreating = false;
        this.editingContactor = new ContactorEditDto();
    }

    // 编辑联系人
    editContact(index: number): void {
        if (this.isEditing) {
            this.message.warn('您有未保存的联系人');
            return;
        }
        this.currentIndex = index;
        this.openCreateContact();
        this.editingContactor.isDefault = this.existedContactors[index].isDefault;
        this.editingContactor.id = this.existedContactors[index].id;
        this.editingContactor.outletId = this.existedContactors[index].outletId;
        this.editingContactor.name = this.existedContactors[index].name;
        this.editingContactor.phoneNum = this.existedContactors[index].phoneNum;
        this.editingContactor.wechatQrcodeUrl = this.existedContactors[index].wechatQrcodeUrl;
        // 正在编辑联系人
        this.isEditing = true;
        // 把联系人名传给创建面板
        this.contactName = this.editingContactor.name;
        // 把微信二维码传给创建面板
        this.uploadPicInfo.pictureUrl = this.editingContactor.wechatQrcodeUrl;

        this.removeContact(index);
    }

    // 删除指定位置联系人
    removeContact(index: number): void {
        this.existedContactors.splice(index, 1);
    }

    // 插入联系人到指定位置
    insertContact(index: number, contact: ContactorEditDto): void {
        this.existedContactors.splice(index, 0, contact)
    }

    // 选择默认联系人
    selectDefaultContact(index: number): void {
        // 关闭所有联系人
        for (let i = 0; i < this.existedContactors.length; i++) {
            this.existedContactors[i].isDefault = false;
        }
        this.existedContactors[index].isDefault = true;
    }

    // 弹出上传Model
    uploadPicModel(): void {
        this.uploadPictureNoneGalleryModel.show();
    }

    // 获取图片上传URL
    getPicUploadInfoHandler(uploadPicInfo: UploadPictureDto) {
        this.uploadPicInfo.pictureId = uploadPicInfo.pictureId
        this.uploadPicInfo.pictureUrl = uploadPicInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    }

    /* 移动端代码 */
    getQrCodePicInfo(qrcodePicInfo: UploadPictureDto): void {
        this.uploadPicInfo.pictureId = qrcodePicInfo.pictureId;
        this.uploadPicInfo.pictureUrl = qrcodePicInfo.pictureUrl;
    }

    setActionFlag(index: number) {
        this.actionFlag[index] = !this.actionFlag[index];
        this.actionFlag.forEach((element, i) => {
            if (i !== index) {
                this.actionFlag[i] = false;
            } else {
                this.actionFlag[index] = !!this.actionFlag[index];
            }
        });
    }
}
