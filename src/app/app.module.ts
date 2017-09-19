import * as ngCommon from '@angular/common';

import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';

import { AbpModule } from '@abp/abp.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { FooterComponent } from './shared/layout/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/layout/header.component';
import { HeaderNotificationsComponent } from './shared/layout/notifications/header-notifications.component';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { MobileSideBarComponent } from './shared/layout/mobile-side-bar/mobile-side-bar.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { NgModule } from '@angular/core';
import { NotificationSettingsModalCompoent } from './shared/layout/notifications/notification-settings-modal.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResponsiveModule } from 'ng2-responsive';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SideBarComponent } from './shared/layout/side-bar.component';
import { UserNotificationHelper } from './shared/layout/notifications/UserNotificationHelper';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HeaderNotificationsComponent,
        SideBarComponent,
        FooterComponent,
        LoginAttemptsModalComponent,
        ChangePasswordModalComponent,
        ChangeProfilePictureModalComponent,
        MySettingsModalComponent,
        NotificationSettingsModalCompoent,
        MobileSideBarComponent,
        PageNotFoundComponent
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
        ResponsiveModule,
    ],
    providers: [
        UserNotificationHelper,
    ]
})
export class AppModule { }
