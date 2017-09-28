import { ABP_HTTP_PROVIDER, AbpModule } from '@abp/abp.module';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { AbpHttpConfiguration, IErrorInfo } from 'abp-ng2-module/src/abpHttp';

import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { AppAuthService } from './app/shared/common/auth/app-auth.service';
import { AppConsts } from '@shared/AppConsts';
import { AppModule } from './app/app.module';
import { AppPreBootstrap } from './AppPreBootstrap';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@shared/common/common.module';
import { NgxAniModule } from 'ngxani';
import { ResponsiveModule } from 'ng2-responsive'
import { RootComponent } from './root.component';
import { RootRoutingModule } from './root-routing.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { ServicesModule } from 'shared/services/services.module';
import { UrlHelper } from './shared/helpers/UrlHelper';
import { appLoadingBusy } from './shared/animations/loadingTransition';

export function appInitializerFactory(injector: Injector) {
    return () => {
        // abp.ui.setBusy();
        appLoadingBusy.setBusy();
        handleLogoutRequest(injector.get(AppAuthService));
        return new Promise<boolean>((resolve, reject) => {
            AppPreBootstrap.run(() => {
                const appSessionService: AppSessionService = injector.get(AppSessionService);
                appSessionService.init().then(
                    (result) => {

                        // Css classes based on the layout
                        if (abp.session.userId) {
                            $('body').attr('class', 'page-md page-header-fixed page-sidebar-closed-hide-logo page-footer-fixed theme-2');
                        } else {
                            $('body').attr('class', 'page-md login');
                        }

                        // abp.ui.clearBusy();
                        appLoadingBusy.clearBusy();
                        resolve(result);
                    },
                    (err) => {
                        // abp.ui.clearBusy();
                        appLoadingBusy.clearBusy();
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

function handleLogoutRequest(authService: AppAuthService) {
    const currentUrl = UrlHelper.initialUrl;
    const returnUrl = UrlHelper.getReturnUrl();
    if (currentUrl.indexOf(('account/logout')) >= 0 && returnUrl) {
        authService.logout(true, returnUrl);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppModule,
        CommonModule.forRoot(),
        AbpModule,
        ServiceProxyModule,
        ServicesModule,
        RootRoutingModule,
        ResponsiveModule,
        NgxAniModule,

    ],
    declarations: [
        RootComponent
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