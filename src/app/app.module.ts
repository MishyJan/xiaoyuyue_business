import * as ngCommon from '@angular/common';

import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';

import { AbpModule } from '@abp/abp.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './shared/layout/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/layout/header.component';
import { HeaderNotificationsComponent } from './shared/layout/notifications/header-notifications.component';
import { MobileSideBarComponent } from './shared/layout/mobile-side-bar/mobile-side-bar.component';
import { NgModule } from '@angular/core';
import { NotificationSettingsModalCompoent } from './shared/layout/notifications/notification-settings-modal.component';
import { PageNotFoundComponent } from './shared/layout/page-not-found/page-not-found.component';
import { ResponsiveModule } from 'ng2-responsive';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SideBarComponent } from './shared/layout/side-bar.component';
import { SupportedBrowsersComponent } from 'app/shared/layout/supported-browsers/supported-browsers.component';
import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HeaderNotificationsComponent,
        SideBarComponent,
        FooterComponent,
        NotificationSettingsModalCompoent,
        MobileSideBarComponent,
        PageNotFoundComponent,
        SupportedBrowsersComponent,
    ],
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,

        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule,
        ResponsiveModule,
    ],
    providers: [
        UserNotificationHelper,
    ]
})
export class AppModule { }
