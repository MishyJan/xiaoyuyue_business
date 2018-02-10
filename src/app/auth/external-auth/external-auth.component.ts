import * as _ from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, Injector, OnInit, transition } from '@angular/core';
import { ExternalLoginProvider, LoginService } from 'shared/services/login.service';
import { ExternalLoginProviderInfoModel, ShortAuthTokenModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { locale } from 'moment-timezone';

@Component({
    selector: 'xiaoyuyue-loading',
    templateUrl: './external-auth.component.html',
    styleUrls: ['./external-auth.component.scss']
})
export class ExternalAuthComponent extends AppComponentBase implements OnInit, AfterViewInit {
    isAuthBind = false;
    constructor(
        injector: Injector,
        private _router: Router,
        private _loginService: LoginService,
        private _activatedRoute: ActivatedRoute,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _cookiesService: CookiesService
    ) {
        super(injector);
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        const params = this.getQueryParams();
        if (params['shortAuthToken'] !== undefined) {
            const input = new ShortAuthTokenModel();
            input.shortAuthToken = params['shortAuthToken']
            this._tokenAuthService.authenticateByShortAuth(input).subscribe((result) => {
                this._cookiesService.setToken(result.accessToken);
                this.saveRedirectUrl(params);

                this._loginService.init(() => {
                    this._loginService.externalAuthenticate(this._loginService.findExternalLoginProvider(params['providerName']), true)
                });
            });
        } else {
            this.externalLogin(params);
        }
    }

    externalLogin(params): void {
        this.saveRedirectUrl(params);

        if (params['isAuthBind'] !== undefined) {
            this.isAuthBind = (params['isAuthBind'] === 'true');
        }

        if (params['providerName'] !== undefined) {
            if (this.isAuthBind) {
                this._loginService.externalBindingCallback(params);
            } else {
                this._loginService.externalLoginCallback(params);
            }
        }
    }

    private getQueryParams() {
        const avaliableQuery = location.search + location.hash.replace('#', '&');
        const param = UrlHelper.getQueryParametersUsingParameters(avaliableQuery);
        if (param['state']) {
            const stataParam = decodeURIComponent(decodeURIComponent(param['state']));
            const stateParam = UrlHelper.getQueryParametersUsingParameters(avaliableQuery.replace('&state=' + param['state'], '') + '&' + stataParam);
            return stateParam;
        } else {
            return param;
        }
    }

    private saveRedirectUrl(params) {
        if (params['redirectUrl'] !== undefined) {
            this._cookiesService.setCookieValue('UrlHelper.redirectUrl', decodeURIComponent(params['redirectUrl']), null, '/');
        }
    }
}
