import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { UploadPictureNoneGalleryComponent } from 'app/shared/common/upload-picture-none-gallery/upload-picture-none-gallery.component';

@Component({
  selector: 'xiaoyuyue-outlet-image',
  templateUrl: './outlet-image.component.html',
  styleUrls: ['./outlet-image.component.scss']
})
export class OutletImageComponent extends AppComponentBase implements OnInit {
  groupId: number = DefaultUploadPictureGroundId.OutletGroup;
  uploadUid: number = new Date().valueOf();
  outletId: number;

  @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
  @Output() pictureInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
  @Input() pictureInfo: UploadPictureDto = new UploadPictureDto();

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
  ) {
    super(injector);
    this.outletId = +this._route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  // 弹出上传Model
  uploadPicModel(): void {
    this.uploadPictureNoneGalleryModel.show();
  }

  // 获取图片上传URL
  getPicUploadInfoHandler(pictureInfo: UploadPictureDto): void {
    this.pictureInfo = pictureInfo;
    this.pictureInfoHandler.emit(pictureInfo);
  }

}
