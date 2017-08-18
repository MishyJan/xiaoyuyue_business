import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { UploadPictureDto } from 'app/admin/shared/utils/upload-picture.dto';
import { UploadPictureNoneGalleryComponent } from 'app/admin/shared/upload-picture-none-gallery/upload-picture-none-gallery.component';

@Component({
  selector: 'xiaoyuyue-upload-org-logo',
  templateUrl: './upload-org-logo.component.html',
  styleUrls: ['./upload-org-logo.component.scss']
})
export class UploadOrgLogoComponent implements OnInit {
  picUrl: string;
  uploadUid: number = Math.round(new Date().valueOf()*Math.random());
  @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
  @Output() orgLogoIngoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
  @Input() orgLogoUrl: string;
  constructor() { }

  ngOnInit() {
  }
  uploadOrgLogo(): void {
    this.uploadPictureNoneGalleryModel.show();
  }

  getPicUploadInfoHandler(picInfo: UploadPictureDto) {
    this.orgLogoUrl = picInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    this.orgLogoIngoHandler.emit(picInfo);
  }
}
