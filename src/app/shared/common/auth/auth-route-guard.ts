import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot
} from '@angular/router';

import { AbpSessionService } from '@abp/session/abp-session.service';
import { AdminPermissions } from '@shared/AdminPermissions';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Injectable } from '@angular/core';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {

    constructor(
        private _permissionChecker: PermissionCheckerService,
        private _router: Router,
        private _sessionService: AppSessionService,
        private _appAuthService: AppAuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this._sessionService.user) {
            this._appAuthService.recordRedirectUrl();

            this._router.navigate(['/auth/login']);
            return false;
        }

        if (!route.data || !route.data['permission']) {
            return true;
        }

        if (this._permissionChecker.isGranted(route.data['permission'])) {
            return true;
        }

        this._router.navigate([this.selectBestRoute()]);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    selectBestRoute(): string {
        if (!this._sessionService.user) {
            this._router.navigate(['/auth/login']);
        } else if (!this._sessionService.tenantId) {
            return '/auth/supply-register';
        }

        if (this._permissionChecker.isGranted(AdminPermissions.tenantDashboard)) {
            return '/dashboard';
        }

        return '/auth/login';
    }

    isWeiXin() {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) + '' === 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }
}