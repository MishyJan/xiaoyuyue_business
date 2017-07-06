import { Component, OnInit, Injector, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UploadPictureNoneGalleryComponent } from 'app/admin/shared/upload-picture-none-gallery/upload-picture-none-gallery.component';
import { UploadPictureDto } from "app/admin/shared/utils/upload-picture.dto";

@Component({
  selector: 'xiaoyuyue-outlet-image',
  templateUrl: './outlet-image.component.html',
  styleUrls: ['./outlet-image.component.scss']
})
export class OutletImageComponent extends AppComponentBase implements OnInit {
  uploadPicInfo: UploadPictureDto = new UploadPictureDto();

  href: string = document.location.href;
  outletId: any = +this.href.substr(this.href.lastIndexOf("/") + 1, this.href.length);

  @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
  @Output() pictureInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
  @Input() pictureInfo: UploadPictureDto;

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    if(this.outletId) {
      this.loadData();
    }

  }

  loadData(): void {
    this.uploadPicInfo = this.pictureInfo;
  }

  // 弹出上传Model
  uploadPicModel(): void {
    this.uploadPictureNoneGalleryModel.show();
  }

  // 获取图片上传URL
  getPicUploadInfoHandler(uploadPicInfo: UploadPictureDto): void {
    this.uploadPicInfo = uploadPicInfo;
    this.pictureInfoHandler.emit(uploadPicInfo);
  }

}
