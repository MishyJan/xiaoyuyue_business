import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { CookiesService } from './../../../shared/services/cookies.service';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { OrganizationInfoDto } from './../../../shared/service-proxies/service-proxies';
import { PictureUrlHelper } from './../../../shared/helpers/PictureUrlHelper';
import { Router } from '@angular/router';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-org-info',
    templateUrl: './org-info.component.html',
    styleUrls: ['./org-info.component.scss'],
    animations: [accountModuleAnimation()],
})
export class OrgInfoComponent extends AppComponentBase implements OnInit, AfterViewInit {
    currentUserName: string;
    uploaded = false;
    filpActive = true;
    savingAndEditing: boolean;
    saving = false;
    tenantInfo: TenantInfoEditDto = new TenantInfoEditDto();
    currentPicDom: any;
    orgLogoAreaWrapHeight: string;
    orgBgAreaWrapHeight: string;
    orgLogoWrapHeight: string;
    groupId: number = DefaultUploadPictureGroundId.OutletGroup;

    constructor(
        injector: Injector,
        private _router: Router,
        private _cookiesService: CookiesService,
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
        setTimeout(function () {
            self.getUploadOrgWrap();
        }, 100);

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
                this.currentUserName = this.tenantInfo.tenancyName = result.tenancyName;
                this.tenantInfo = result;
            })
    }

    getUploadOrgWrap(): void {
        const orgLogoAreaWrapHeight = +$('.upload-logo-pic-wrap').width() + 'px';
        const orgBgAreaWrapHeight = +$('.upload-bg-pic-wrap').width() * 0.6 + 'px';
        $('.upload-logo-pic-wrap').height(orgLogoAreaWrapHeight);
        $('.upload-bg-pic-wrap').height(orgBgAreaWrapHeight);
    }

    save(): void {
        this.saving = true;
        this._tenantInfoServiceProxy
            .updateTenantInfo(this.tenantInfo)
            .finally(() => { this.saving = false })
            .subscribe(result => {
                abp.event.trigger('userNameChanged');
                this._router.navigate(['/outlet/list']);
            })
    }

    saveAndEdit() {
        if (this.currentUserName !== this.tenantInfo.tenancyName) {
            this.message.confirm('是否更改您的机构名称?', (result) => {
                if (result) {
                    this.updateData(() => {
                        abp.event.trigger('userNameChanged');
                    })
                }
            })
        } else {
            this.updateData(() => {
                this.filpActive = true;
            })
        }
    }

    private updateData(callback: any): void {
        this.savingAndEditing = true;
        this.currentUserName = this.tenantInfo.tenancyName;
        this._tenantInfoServiceProxy
            .updateTenantInfo(this.tenantInfo)
            .finally(() => { this.savingAndEditing = false })
            .subscribe(() => {
                callback();
                this.notify.success('保存成功!');
            });
    }



    /* 移动端代码 */

    // 取消编辑机构信息
    cancel(): void {
        // this.input = new CurrentUserProfileEditDto(this.userProfileData);
        this.filpActive = true;
    }

    // 机构信息详情翻转
    showEdit(): void {
        this.filpActive = false;
    }

    // 获取上传logo图片信息
    getLogoUploadHandler(picInfo: UploadPictureDto): void {
        this.tenantInfo.logoId = picInfo.pictureId;
        this.tenantInfo.logoUrl = picInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    }

    // 获取上传logo图片信息
    getOrgBgUploadHandler(picInfo: UploadPictureDto): void {
        this.tenantInfo.backgroundPictureId = picInfo.pictureId;
        this.tenantInfo.backgroundPictureUrl = picInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    }
}
