﻿import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';

import { AbpModule, ABP_HTTP_PROVIDER } from '@abp/abp.module';

import { AppModule } from './app/app.module';
import { CommonModule } from '@shared/common/common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { RootRoutingModule } from './root-routing.module';

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';

import { RootComponent } from './root.component';
import { AppPreBootstrap } from './AppPreBootstrap';
import { AbpHttpConfiguration, IErrorInfo } from "abp-ng2-module/src/abpHttp";

import { NgxAniModule } from 'ngxani';
import { LoadingComponent } from './auth/loading/loading.component';

export function appInitializerFactory(injector: Injector) {
    return () => {
        abp.ui.setBusy();
        return new Promise<boolean>((resolve, reject) => {
            AppPreBootstrap.run(() => {
                var appSessionService: AppSessionService = injector.get(AppSessionService);
                appSessionService.init().then(
                    (result) => {

                        //Css classes based on the layout
                        if (abp.session.userId) {
                            $('body').attr('class', 'page-md page-header-fixed page-sidebar-closed-hide-logo page-footer-fixed theme-2');
                        } else {
                            $('body').attr('class', 'page-md login');
                        }


                        abp.ui.clearBusy();
                        resolve(result);
                    },
                    (err) => {
                        abp.ui.clearBusy();
                        reject(err);
                    }
                );
            });
        });
    }
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppModule,
        CommonModule.forRoot(),
        AbpModule,
        ServiceProxyModule,

        RootRoutingModule,

        NgxAniModule
    ],
    declarations: [
        RootComponent,
        LoadingComponent
    ],
    providers: [
        ABP_HTTP_PROVIDER,
        { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector],
            multi: true
        }
    ],
    bootstrap: [RootComponent]
})
export class RootModule {

}