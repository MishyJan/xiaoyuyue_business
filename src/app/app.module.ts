import * as ngCommon from '@angular/common';

import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';

import { AbpModule } from '@abp/abp.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { FooterComponent } from './shared/layout/footer.component';
import { FormsModule } from '@angular/forms';
import { GridDataResultsModule } from '@shared/grid-data-results/grid-result.modules';
import { HeaderComponent } from './shared/layout/header.component';
import { HeaderNotificationsComponent } from './shared/layout/notifications/header-notifications.component';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { NgModule } from '@angular/core';
import { NotificationSettingsModalCompoent } from './shared/layout/notifications/notification-settings-modal.component';
import { NotificationsComponent } from './shared/layout/notifications/notifications.component';
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
        NotificationsComponent,
        NotificationSettingsModalCompoent,
    ],
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,

        GridModule,
        DropDownsModule,
        ButtonsModule,
        SharedModule,
        DialogModule,
        DateInputModule,

        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        FileUploadModule,
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule,
        GridDataResultsModule
    ],
    providers: [
        UserNotificationHelper,
    ]
})
export class AppModule { }
