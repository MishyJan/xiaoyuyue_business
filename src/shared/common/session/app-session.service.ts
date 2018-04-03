import { ApplicationInfoDto, GetCurrentLoginInformationsOutput, SessionServiceProxy, TenantLoginInfoDto, UserLoginInfoDto } from '@shared/service-proxies/service-proxies'

import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service'
import { Injectable } from '@angular/core';
import { GetCurrentFeatures } from 'shared/AppConsts';
import { FeatureCheckerService } from 'abp-ng2-module/src/features/feature-checker.service';
import { MessageService } from '@abp/message/message.service';
import { CookiesService } from 'shared/services/cookies.service';
import { Router } from '@angular/router';
@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _activeMenu: string;
    private _uploadPictureToken: string;

    constructor(
        private _router: Router,
        private _message: MessageService,
        private _feature: FeatureCheckerService,
        private _sessionService: SessionServiceProxy,
        private _cookiesService: CookiesService,
        private _abpMultiTenancyService: AbpMultiTenancyService) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    get impersonatorUserId(): number | undefined {
        return abp.session.impersonatorUserId;
    }

    get impersonatorTenantId(): number | undefined {
        return abp.session.impersonatorTenantId;
    }

    get multiTenancySide(): abp.multiTenancy.sides {
        return abp.session.multiTenancySide;
    }

    getShownLoginName(): string {
        return this._user.userName;
    }

    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                resolve(true);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        this._cookiesService.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    // 是否可以试用，仅免费版 且 非试用版 才可试用
    get canTrialEdition(): boolean {
        return !this.tenant.hadTrialed && this.tenant.edition.isFree;
    }

    // 门店数量是否达到当前版本上限
    // canLimitCreateOutlet(): boolean;
    // canLimitCreateOutlet(str: string): void;
    canLimitCreateOutlet(str?: string): boolean {
        // 如果当前版本的最大数量为0，则不限制，直接返回true
        const MaxOutletCount = +this._feature.getValue('App.MaxOutletCount');
        if (MaxOutletCount === 0) { return true; }
        const RemainOutletNum = MaxOutletCount - this.tenant.outletNum;
        if (str && RemainOutletNum <= 0) {
            this._message.confirm(str, (result) => {
                this._router.navigate(['/account/condition']);
            });
        }
        return RemainOutletNum > 0 ? true : false;
    }

    // 预约数量是否达到当前版本上限
    canLimitCreateBooking(str?: string): boolean {
        // 如果当前版本的最大数量为0，则不限制，直接返回true
        const MaxBookingCount = +this._feature.getValue('App.MaxBookingCount');
        if (MaxBookingCount === 0) { return true; }
        const RremainBookingNum = MaxBookingCount - this.tenant.bookingNum;

        if (str && RremainBookingNum <= 0) {
            this._message.confirm(str, (result) => {
                this._router.navigate(['/account/condition']);
            });
        }
        return RremainBookingNum > 0 ? true : false;
    }

    private isCurrentTenant(tenantId?: number) {
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }

    changeActiveMenu(menuName: string) {
        this._activeMenu = menuName;
    }

    get activeMenu(): string {
        return this._activeMenu;
    }
}