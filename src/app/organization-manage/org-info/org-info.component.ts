import * as _ from 'lodash';

import { AfterViewInit, Component, Injector, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { CookiesService } from '@shared/services/cookies.service';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { OrganizationInfoDto } from '@shared/service-proxies/service-proxies';
import { PictureUrlHelper } from '@shared/helpers/PictureUrlHelper';
import { Router } from '@angular/router';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { WangEditorComponent } from 'app/shared/common/wang-editor/wang-editor.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-org-info',
    templateUrl: './org-info.component.html',
    styleUrls: ['./org-info.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()],
})
export class OrgInfoComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy {
    currentUserName: string;
    uploaded = false;
    filpActive = true;
    savingAndEditing: boolean;
    saving = false;
    tenantInfo: TenantInfoEditDto = new TenantInfoEditDto();
    originalTenantInfo: TenantInfoEditDto = new TenantInfoEditDto();
    currentPicDom: any;
    orgLogoAreaWrapHeight: string;
    orgBgAreaWrapHeight: string;
    orgLogoWrapHeight: string;
    groupId: number = DefaultUploadPictureGroundId.OutletGroup;
    interval: NodeJS.Timer;

    @ViewChild('wangEditorModel') wangEditorModel: WangEditorComponent;

    constructor(
        injector: Injector,
        private _router: Router,
        private _cookiesService: CookiesService,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _localStorageService: LocalStorageService,
    ) {
        super(
            injector
        );
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    ngAfterViewInit() {
        this.loadData();
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
                this.originalTenantInfo = _.cloneDeep(this.tenantInfo);
                this.checkDataNeed2Reconvert(); // 检查数据是否需要恢复
                this.startSaveEditInfoInBower(); // 开始保存临时数据
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
        this.confirmUpdatetenancyName(() => {
            this._router.navigate(['/outlet/list']);
        });
    }

    saveAndEdit() {
        this.savingAndEditing = true;
        this.confirmUpdatetenancyName(() => {
            this.filpActive = true;
        });
    }

    private confirmUpdatetenancyName(callback: any) {
        if (this.currentUserName !== this.tenantInfo.tenancyName) {
            this.message.confirm(this.l('Organization.ChangeName'), (result) => {
                if (result) {
                    this.updateData(() => {
                        callback();
                        abp.event.trigger('userNameChanged');
                    })
                } else {
                    callback();
                }
            })
        } else {
            this.updateData(() => {
                callback();
            })
        }
    }

    private updateData(callback: any): void {
        this.wangEditorModel.save();
        this.currentUserName = this.tenantInfo.tenancyName;
        this._tenantInfoServiceProxy
            .updateTenantInfo(this.tenantInfo)
            .finally(() => {
                this.savingAndEditing = false
                this.saving = false;
            })
            .subscribe(() => {
                this._localStorageService.removeItem(abp.utils.formatString(AppConsts.templateEditStore.orgInfo, this.appSession.tenantId));
                callback();
                this.removeEditCache(); // 清理缓存数据
                this.notify.success(this.l('SavaSuccess'));
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
        this.tenantInfo.logoUrl = picInfo.pictureUrl;
    }

    // 获取上传logo图片信息
    getOrgBgUploadHandler(picInfo: UploadPictureDto): void {
        this.tenantInfo.backgroundPictureId = picInfo.pictureId;
        this.tenantInfo.backgroundPictureUrl = picInfo.pictureUrl;
    }


    checkDataNeed2Reconvert() {
        this._localStorageService.getItemOrNull<TenantInfoEditDto>(this.getCacheItemKey())
            .then((editCache) => {
                if (editCache && this.isDataNoEqual(editCache, this.tenantInfo)) {
                    this.message.confirm(this.l('TemporaryData.Unsaved'), this.l('TemporaryData.Recover'), (confirm) => {
                        if (confirm) {
                            this.tenantInfo = editCache;
                            this.originalTenantInfo = _.cloneDeep(this.tenantInfo);
                        } else {
                            this.removeEditCache();
                        }
                    });
                }
            });

    }

    startSaveEditInfoInBower() {
        this.interval = setInterval(() => {
            if (this.isDataNoSave()) {
                this._localStorageService.setItem(abp.utils.formatString(AppConsts.templateEditStore.orgInfo, this.appSession.tenantId), this.tenantInfo);
                this.originalTenantInfo = _.cloneDeep(this.tenantInfo);
            }
        }, 3000)
    }

    removeEditCache() {
        this._localStorageService.removeItem(abp.utils.formatString(AppConsts.templateEditStore.orgInfo, this.appSession.tenantId));
    }

    isDataNoSave(): boolean {
        return this.isDataNoEqual(this.originalTenantInfo, this.tenantInfo);
    }

    isDataNoEqual(source, destination): boolean {
        return JSON.stringify(source) !== JSON.stringify(destination);
    }

    // 富文本编辑器回调事件
    editorContentChangeHandler($event: string): void {
        this.tenantInfo.description = $event;
    }

    private getCacheItemKey() {
        return abp.utils.formatString(AppConsts.templateEditStore.orgInfo, this.appSession.tenantId);
    }
}
