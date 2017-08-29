import { Injectable } from '@angular/core';
import { PermissionCheckerService } from "@abp/auth/permission-checker.service";
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AdminPermissions } from '@shared/AdminPermissions';
import { UrlHelper } from '@shared/helpers/UrlHelper';

import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild, Params, ActivatedRoute
} from '@angular/router';
import { LoginService } from "shared/services/login.service";

@Injectable()
export class ExternalLoginGuard implements CanActivate {

    constructor(
        private _router: Router,
        // private _ExternalLoginProvider: ExternalLoginProvider,
        private _LoginService: LoginService,
        private _activatedRoute: ActivatedRoute,
    ) { }

    canActivate(params: Params): boolean { 
        var providerName = undefined;

        this._activatedRoute.queryParams.subscribe((params: Params) => {
            providerName = params['providerName'];
            if (providerName !== undefined) {
                this._LoginService.externalLoginCallback(params);
            } else {
                return;
            }
        });
        return true;
    }
}