import { Component, ViewContainerRef, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';

import * as moment from 'moment';
import { LoginService } from "shared/services/login.service";
import { BookingServiceProxy } from "shared/service-proxies/service-proxies";

@Component({
    templateUrl: './auth.component.html',
    styleUrls: [
        './auth.component.scss',
    ],
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent extends AppComponentBase implements OnInit {

    private viewContainerRef: ViewContainerRef;

    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    public constructor(
        injector: Injector,
        private _loginService: LoginService,
        viewContainerRef: ViewContainerRef,
        private _bookingServiceProxy: BookingServiceProxy
    ) {
        super(injector);

        this.viewContainerRef = viewContainerRef; // We need this small hack in order to catch application root view container ref for modals
    }

    showTenantChange(): boolean {
        return abp.multiTenancy.isEnabled && !this.supportsTenancyNameInUrl();
    }

    ngOnInit(): void {
        this._loginService.init();
        $('body').attr('class', 'page-md login');
    }

    private supportsTenancyNameInUrl() {
        return (AppConsts.appBaseUrlFormat && AppConsts.appBaseUrlFormat.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) >= 0);
    }

    
}
