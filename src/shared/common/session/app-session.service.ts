import { ApplicationInfoDto, GetCurrentLoginInformationsOutput, SessionServiceProxy, TenantLoginInfoDto, UserLoginInfoDto } from '@shared/service-proxies/service-proxies'

import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service'
import { CookiesService } from './../../services/cookies.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _activeMenu: string;
    private _uploadPictureToken: string;

    constructor(
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
    canTrialEdition(): boolean {
        return !this.tenant.hadTrialed && this.tenant.edition.isFree;
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