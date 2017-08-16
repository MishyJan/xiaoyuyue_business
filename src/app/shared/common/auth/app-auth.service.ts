import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
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
        const domainArr = ['http://user.xiaoyuyue.com/', 'http://localhost:5201/'];
        if (domainArr.indexOf(location.href) < 0) {
            this._utilsService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
        }
    }
}