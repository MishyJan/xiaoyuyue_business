import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { UploadPictureNoneGalleryComponent } from 'app/shared/common/upload-picture-none-gallery/upload-picture-none-gallery.component';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';

@Component({
    selector: 'xiaoyuyue-upload-bg',
    templateUrl: './upload-bg.component.html',
    styleUrls: ['./upload-bg.component.scss']
})
export class UploadOrgBgComponent extends AppComponentBase implements OnInit {
    defaultTenantBgUrl = 'assets/common/images/booking/center-bg.jpg';
    
    picUrl: string;
    uploadUid: number = Math.round(new Date().valueOf() * Math.random());
    groupId: number = DefaultUploadPictureGroundId.OutletGroup;
    @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
    @Output() orgBgInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
    @Input() orgBgUrl: string;

    constructor(injector: Injector) {
        super(
            injector
        );
    }

    ngOnInit() {

    }

    uploadOrgBg(): void {
        if (this.isGranted(this.permissions.organization_BaseInfo)) {
            this.uploadPictureNoneGalleryModel.show();
        }
    }

    getPicUploadInfoHandler(picInfo: UploadPictureDto) {
        this.orgBgUrl = picInfo.pictureUrl.changingThisBreaksApplicationSecurity;
        this.orgBgInfoHandler.emit(picInfo);
    }

    getTenantBgurl(): string {
        return this.orgBgUrl ? this.orgBgUrl : this.defaultTenantBgUrl;
    }
}
