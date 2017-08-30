import { AppConsts } from '@shared/AppConsts';
import { Injectable } from '@angular/core';
import { UtilsService } from '@abp/utils/utils.service';

@Injectable()
export class AppAuthService {

    constructor(
        private _utilsService: UtilsService
    ) { }

    logout(reload?: boolean, returnUrl?: string): void {
        abp.auth.clearToken();
        if (reload !== false) {
            if (returnUrl) {
                location.href = returnUrl;
            } else {
                location.href = AppConsts.appBaseUrl;
            }
        }
    }

    isLogin(): boolean {
        if (abp.auth.getToken()) {
            return true;
        }
        return false;
    }

    recordRedirectUrl(): void {
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1);
        this._utilsService.deleteCookie('UrlHelper.redirectUrl', '/');
        // 测试域名
        const domainArr = ['http://business.xiaoyuyue.com/', 'http://localhost:5202/'];
        if (domainArr.indexOf(location.href) < 0) {
            this._utilsService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
        }
    }
}