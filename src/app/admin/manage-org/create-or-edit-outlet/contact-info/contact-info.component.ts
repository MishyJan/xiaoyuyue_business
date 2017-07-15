import { Component, OnInit, Injector, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { OutletServiceServiceProxy, CreateOrUpdateOutletInput, ContactorEditDto } from 'shared/service-proxies/service-proxies';
import { AppComponentBase } from 'shared/common/app-component-base';
import { UploadPictureNoneGalleryComponent } from "app/admin/shared/upload-picture-none-gallery/upload-picture-none-gallery.component";
import { UploadPictureDto } from "app/admin/shared/utils/upload-picture.dto";

@Component({
  selector: 'xiaoyuyue-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent extends AppComponentBase implements OnInit {
  uploadPicInfo: UploadPictureDto = new UploadPictureDto();
  currentIndex: number;
  editingContact: boolean = false;
  hideContactIndex: number;
  contactName: string = "";

  input: CreateOrUpdateOutletInput = new CreateOrUpdateOutletInput();

  href: string = document.location.href;
  outletId: any = +this.href.substr(this.href.lastIndexOf("/") + 1, this.href.length);

  // 保存本地数据所有联系人
  localAllContact: ContactorEditDto[] = [];
  // 保存本地数据单个联系人
  localSingleContact: ContactorEditDto = new ContactorEditDto();

  // 是否是新增，新增显示空数据；否则显示用户数据
  isLocalOrOnline: boolean = this.outletId;
  isCreateContact: boolean = false;

  @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
  @Output() contactorEditHandler: EventEmitter<ContactorEditDto[]> = new EventEmitter();
  @Input() onlineAllContactors: ContactorEditDto[];

  constructor(
    injector: Injector,
    private _outletServiceServiceProxy: OutletServiceServiceProxy
  ) {
    super(
      injector
    );
  }

  ngOnInit() {
    console.log(this.localAllContact);
    console.log(this.onlineAllContactors);
    this.loadData();
  }

  ngAfterViewInit() {
    let self = this;
    if (!this.outletId) {
      return;
    }
    setTimeout(function () {
      self.localAllContact = self.onlineAllContactors;
      console.log(self.localAllContact);
    }, 1000)
  }

  loadData(): void {
  }

  save(): void {
    this.localSingleContact.isDefault = this.localSingleContact.isDefault || false;
    this.localSingleContact.wechatQrcodeUrl = this.uploadPicInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    if (this.editingContact) {
      this.localSingleContact.wechatQrcodeUrl = this.uploadPicInfo.pictureUrl;
      this.insertContact(this.currentIndex, this.localSingleContact);
      this.closeCreateContact();
      return;
    }
    this.localAllContact.push(this.localSingleContact);
    this.closeCreateContact();

    // 默认让第一个为选中状态
    if (this.localAllContact.length == 1) {
      this.localAllContact[0].isDefault = true;
    }

    this.contactorEditHandler.emit(this.localAllContact)
  }

  cancel(): void {
    if (this.editingContact) {
      this.save();
      return;
    }
    this.closeCreateContact();
  }

  // 打开创建面板
  openCreateContact(): void {
    this.isCreateContact = true;
    this.contactName = "";
    this.uploadPicInfo.pictureUrl = "";
  }

  // 关闭创建面板
  closeCreateContact(): void {
    this.isCreateContact = false;
    this.localSingleContact = new ContactorEditDto();
  }

  // 编辑联系人
  editContact(index: number): void {
    this.currentIndex = index;
    this.openCreateContact();
    this.localSingleContact.isDefault = this.localAllContact[index].isDefault;
    this.localSingleContact.name = this.localAllContact[index].name;
    this.localSingleContact.phoneNum = this.localAllContact[index].phoneNum;
    this.localSingleContact.wechatQrcodeUrl = this.localAllContact[index].wechatQrcodeUrl;
    // 正在编辑联系人
    this.editingContact = true;
    // 把联系人名传给创建面板
    this.contactName = this.localSingleContact.name;
    // 把微信二维码传给创建面板
    this.uploadPicInfo.pictureUrl = this.localSingleContact.wechatQrcodeUrl;

    this.removeContact(index);
  }

  // 删除指定位置联系人
  removeContact(index: number): void {
    this.localAllContact.splice(index, 1);
  }

  // 插入联系人到指定位置
  insertContact(index: number, contact: ContactorEditDto): void {
    this.localAllContact.splice(index, 0, contact)
  }

  // 选择默认联系人
  selectDefaultContact(index: number): void {
    // 关闭所有联系人
    for (let i = 0; i < this.localAllContact.length; i++) {
      this.localAllContact[i].isDefault = false;
    }
    this.localAllContact[index].isDefault = true;
  }

  // 弹出上传Model
  uploadPicModel(): void {
    this.uploadPictureNoneGalleryModel.show();
  }

  // 获取图片上传URL
  getPicUploadInfoHandler(uploadPicInfo: UploadPictureDto) {
    this.uploadPicInfo = uploadPicInfo;
  }

}
