import { Component, Injector, OnInit } from '@angular/core';
import { TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-org-info',
    templateUrl: './org-info.component.html',
    styleUrls: ['./org-info.component.scss'],
    animations: [accountModuleAnimation()],
})
export class OrgInfoComponent extends AppComponentBase implements OnInit {
    savingAndEditing: boolean;
    saving = false;
    updatedOrgBgPicture = false;
    updatedOrgLogoPicture = false;
    input: TenantInfoEditDto = new TenantInfoEditDto();
    currentPicDom: any;
    picUrl: string;
    orgLogoAreaWrapHeight: string;
    orgBgAreaWrapHeight: string;
    orgLogoWrapHeight: string;

    sendOrgBgInfo: UploadPictureDto = new UploadPictureDto();
    sendOrgLogoInfo: UploadPictureDto = new UploadPictureDto();
    constructor(
        injector: Injector,
        private _router: Router,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit() {
        const self = this;
        this.getUploadOrgWrap();

        window.addEventListener('resize', function () {
            self.getUploadOrgWrap();
        })
    }

    loadData(): void {
        this._tenantInfoServiceProxy
            .getTenantInfoForEdit()
            .subscribe(result => {
                if (!result) {
                    return;
                }
                this.input.tenancyName = result.tenancyName;
                this.input.tagline = result.tagline;
                this.input.description = result.description;

                this.sendOrgBgInfo.pictureUrl = result.backgroundPictureUrl;
                this.sendOrgBgInfo.pictureId = result.backgroundPictureId;

                this.sendOrgLogoInfo.pictureUrl = result.logoUrl;
                this.sendOrgLogoInfo.pictureId = result.logoId;
            })
    }

    getUploadOrgWrap(): void {
        const orgLogoAreaWrapHeight = +$('.upload-logo-pic-wrap').width() + 'px';
        const orgBgAreaWrapHeight = +$('.upload-bg-pic-wrap').width() * 0.6 + 'px';
        $('.upload-logo-pic-wrap').height(orgLogoAreaWrapHeight);
        $('.upload-bg-pic-wrap').height(orgBgAreaWrapHeight);
    }

    save(): void {
        if (!this.updatedOrgBgPicture) {
            this.input.backgroundPictureId = this.sendOrgBgInfo.pictureId;
            this.input.backgroundPictureUrl = this.sendOrgBgInfo.pictureUrl;
        }

        if (!this.updatedOrgLogoPicture) {
            this.input.logoId = this.sendOrgLogoInfo.pictureId;
            this.input.logoUrl = this.sendOrgLogoInfo.pictureUrl;
        }

        this.saving = true;
        this._tenantInfoServiceProxy
            .updateTenantInfo(this.input)
            .finally(() => { this.saving = false })
            .subscribe(result => {
                this.notify.success('信息已完善');
                this._router.navigate(['/outlet/list']);
            })
    }

    saveAndEdit() {
        if (!this.updatedOrgBgPicture) {
            this.input.backgroundPictureId = this.sendOrgBgInfo.pictureId;
            this.input.backgroundPictureUrl = this.sendOrgBgInfo.pictureUrl;
        }

        if (!this.updatedOrgLogoPicture) {
            this.input.logoId = this.sendOrgLogoInfo.pictureId;
            this.input.logoUrl = this.sendOrgLogoInfo.pictureUrl;
        }
        this.savingAndEditing = true;
        this._tenantInfoServiceProxy
            .updateTenantInfo(this.input)
            .finally(() => { this.savingAndEditing = false })
            .subscribe(() => {
                this.notify.success('保存成功!');
            });
    }

    orgBgInfo(orgBgInfo: UploadPictureDto): void {
        this.updatedOrgBgPicture = true;
        this.input.backgroundPictureId = orgBgInfo.pictureId;
        this.input.backgroundPictureUrl = orgBgInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    }

    orgLogoInfo(orgLogoInfo: UploadPictureDto): void {
        this.updatedOrgLogoPicture = true;
        this.input.logoId = orgLogoInfo.pictureId;
        this.input.logoUrl = orgLogoInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    }
}
