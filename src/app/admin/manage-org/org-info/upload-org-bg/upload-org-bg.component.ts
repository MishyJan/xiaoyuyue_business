import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UploadPictureNoneGalleryComponent } from 'app/admin/shared/upload-picture-none-gallery/upload-picture-none-gallery.component';
import { UploadPictureDto } from 'app/admin/shared/utils/upload-picture.dto';

@Component({
  selector: 'xiaoyuyue-upload-org-bg',
  templateUrl: './upload-org-bg.component.html',
  styleUrls: ['./upload-org-bg.component.scss']
})
export class UploadOrgBgComponent implements OnInit {
  picUrl: string;
  uploadUid: number = new Date().valueOf();
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
