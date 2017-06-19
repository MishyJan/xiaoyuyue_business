import { NgModule, APP_INITIALIZER } from '@angular/core';
import * as ngCommon from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderNotificationsComponent } from './shared/layout/notifications/header-notifications.component';


import { AbpModule, ABP_HTTP_PROVIDER } from '@abp/abp.module';

import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

import { AppSessionService } from '@shared/common/session/app-session.service';
import { LinkedAccountService } from './shared/layout/linked-account.service';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';
import { NotificationSettingsModalCompoent } from './shared/layout/notifications/notification-settings-modal.component';
import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';

import { GridModule } from '@progress/kendo-angular-grid';
import { GridDataResultsModule } from '@shared/grid-data-results/grid-result.modules';
import { LoginAttemptsModalComponent } from "app/shared/layout/login-attempts-modal.component";
import { LinkedAccountsModalComponent } from "app/shared/layout/linked-accounts-modal.component";
import { ChangeProfilePictureModalComponent } from "app/shared/layout/profile/change-profile-picture-modal.component";
import { MySettingsModalComponent } from "app/shared/layout/profile/my-settings-modal.component";
import { LinkAccountModalComponent } from "app/shared/layout/link-account-modal.component";
import { ChangePasswordModalComponent } from "app/shared/layout/profile/change-password-modal.component";
import { HeaderComponent } from "app/shared/layout/header/header.component";
import { SideBarComponent } from "app/shared/layout/side-bar/side-bar.component";
import { FooterComponent } from "app/shared/layout/footer/footer.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HeaderNotificationsComponent,
        SideBarComponent,
        FooterComponent,
        LoginAttemptsModalComponent,
        LinkedAccountsModalComponent,
        LinkAccountModalComponent,
        ChangePasswordModalComponent,
        ChangeProfilePictureModalComponent,
        MySettingsModalComponent,
        NotificationsComponent,
        NotificationSettingsModalCompoent,
    ],
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,

        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        FileUploadModule,

        AbpModule,

        AppRoutingModule,

        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule,

        GridModule,
        GridDataResultsModule
    ],
    providers: [
        LinkedAccountService,
        UserNotificationHelper,
    ]
})
export class AppModule { }
