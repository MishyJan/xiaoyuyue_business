import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { OutletServiceServiceProxy, CreateOrUpdateOutletInput, ContactorEditDto } from 'shared/service-proxies/service-proxies';
import { AppComponentBase } from 'shared/common/app-component-base';
import { UploadPictureNoneGalleryComponent } from "app/admin/shared/upload-picture-none-gallery/upload-picture-none-gallery.component";

@Component({
  selector: 'xiaoyuyue-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent extends AppComponentBase implements OnInit {
  weChatPicUrl: string;
  hideContactIndex: number;
  contactName: string = "";

  input: CreateOrUpdateOutletInput = new CreateOrUpdateOutletInput();

  href: string = document.location.href;
  bookingId: any = +this.href.substr(this.href.lastIndexOf("/") + 1, this.href.length);

  uniqueUid: string = "ContactInfo";

  // 保存本地数据所有联系人
  localAllContact: ContactorEditDto[] = [];
  // 保存本地数据单个联系人
  localSingleContact: ContactorEditDto = new ContactorEditDto();

  // 是否是新增，新增显示空数据；否则显示用户数据
  isLocalOrOnline: boolean = this.bookingId;
  isCreateContact: boolean = false;

  @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;

  constructor(
    injector: Injector,
    private _outletServiceServiceProxy: OutletServiceServiceProxy
  ) {
    super(
      injector
    );
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    if (!this.bookingId) {

      return;
    }

  }

  save(): void {
    this.localSingleContact.isDefault = this.localSingleContact.isDefault || false;
    this.localAllContact.push(this.localSingleContact);
    this.closeCreateContact();

    // 默认让第一个为选中状态
    if (this.localAllContact.length == 1) {
      this.localAllContact[0].isDefault = true;
    }
  }

  // 打开创建面板
  openCreateContact(): void {
    this.isCreateContact = true;
  }

  // 关闭创建面板
  closeCreateContact(): void {
    this.isCreateContact = false;
    this.localSingleContact = new ContactorEditDto();
  }

  // 编辑联系人
  editContact(index: number): void {
    this.openCreateContact();
    this.hideContact(index);
    this.localSingleContact.isDefault = this.localAllContact[index].isDefault;
    this.localSingleContact.name = this.localAllContact[index].name;
    this.localSingleContact.phoneNum = this.localAllContact[index].phoneNum;
    // 把联系人名传给创建面板
    this.contactName = this.localSingleContact.name;
  }

  // 隐藏联系人面板
  hideContact(index: number): void {
    this.hideContactIndex = index;
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
  getPicUrlHandler(picUrl: string) {
    this.weChatPicUrl = picUrl;
  }

}
