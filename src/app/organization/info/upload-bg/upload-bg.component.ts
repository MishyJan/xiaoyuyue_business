import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { UploadPictureNoneGalleryComponent } from 'app/shared/upload-picture-none-gallery/upload-picture-none-gallery.component';

@Component({
  selector: 'xiaoyuyue-upload-bg',
  templateUrl: './upload-bg.component.html',
  styleUrls: ['./upload-bg.component.scss']
})
export class UploadOrgBgComponent implements OnInit {
  picUrl: string;
  uploadUid: number = Math.round(new Date().valueOf() * Math.random());
  @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
  @Output() orgBgInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
  @Input() orgBgUrl: string;

  constructor() { }

  ngOnInit() {
  }

  uploadOrgBg(): void {
    this.uploadPictureNoneGalleryModel.show();
  }

  getPicUploadInfoHandler(picInfo: UploadPictureDto) {
    this.orgBgUrl = picInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    this.orgBgInfoHandler.emit(picInfo);
  }

}
