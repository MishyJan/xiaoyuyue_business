import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { UploadPictureNoneGalleryComponent } from 'app/shared/common/upload-picture-none-gallery/upload-picture-none-gallery.component';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';

@Component({
    selector: 'xiaoyuyue-upload-logo',
    templateUrl: './upload-logo.component.html',
    styleUrls: ['./upload-logo.component.scss']
})
export class UploadOrgLogoComponent extends AppComponentBase implements OnInit {
    defaultTenantLogoUrl = 'assets/common/images/logo.jpg';

    picUrl: string;
    uploadUid: number = Math.round(new Date().valueOf() * Math.random());
    groupId: number = DefaultUploadPictureGroundId.OutletGroup;
    @ViewChild('uploadPictureNoneGalleryModel') uploadPictureNoneGalleryModel: UploadPictureNoneGalleryComponent;
    @Output() orgLogoIngoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
    @Input() orgLogoUrl: string;
    constructor(injector: Injector) {
        super(
            injector
        );
    }

    ngOnInit() {
    }

    uploadOrgLogo(): void {
        if (this.isGranted(this.permissions.organization_BaseInfo)) {
            this.uploadPictureNoneGalleryModel.show();
        }
    }

    getPicUploadInfoHandler(picInfo: UploadPictureDto) {
        this.orgLogoUrl = picInfo.pictureUrl;
        this.orgLogoIngoHandler.emit(picInfo);
    }

    getTenantLogoUrl(): string {
        return this.orgLogoUrl ? this.orgLogoUrl : this.defaultTenantLogoUrl;
    }
}
