import * as ngCommon from '@angular/common';

import { ModuleWithProviders, NgModule } from '@angular/core';

import { AbpModule } from '@abp/abp.module';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { BreadcrumbComponent } from './bread-crumb/breadcrumb.component';
import { CommonModule } from '@shared/common/common.module';
import { DatePickerComponent } from './timing/date-picker.component';
import { DateRangePickerComponent } from './timing/date-range-picker.component';
import { EmptyPageComponent } from 'app/shared/common/empty-page/empty-page.component';
import { FormsModule } from '@angular/forms';
import { IndicatorDirective } from './indicator/indicator.directive';
import { JqPluginDirective } from './libs/jq-plugin.directive';
import { MobileUploadPictureComponent } from './mobile-upload-picture/mobile-upload-picture.component';
import { MobileUploadPictureListComponent } from './mobile-upload-picture-list/mobile-upload-picture-list.component';
import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { RouterModule } from '@angular/router';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { TipsComponent } from './tips/tips.component';
import { UploadPictureGalleryComponent } from './upload-picture-gallery/upload-picture-gallery.component';
import { UploadPictureNoneGalleryComponent } from './upload-picture-none-gallery/upload-picture-none-gallery.component';
import { UtilsModule } from '@shared/utils/utils.module';
import { ViewArtworkMasterComponent } from './view-artwork-master/view-artwork-master.component';
import { WangEditorComponent } from './wang-editor/wang-editor.component';
import { LanguageSwitchComponent } from 'app/shared/common/language-switch-component/language-switch.component';
import { SendCodeComponent } from 'app/shared/common/send-code/send-code.component';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        AbpModule,
        CommonModule,
        NgxPaginationModule,
        RouterModule
    ],
    declarations: [
        TimeZoneComboComponent,
        JqPluginDirective,
        DateRangePickerComponent,
        DatePickerComponent,
        TipsComponent,
        UploadPictureGalleryComponent,
        UploadPictureNoneGalleryComponent,
        BreadcrumbComponent,
        IndicatorDirective,
        EmptyPageComponent,
        MobileUploadPictureComponent,
        WangEditorComponent,
        MobileUploadPictureListComponent,
        ViewArtworkMasterComponent,
        QrCodeComponent,
        SendCodeComponent,
        LanguageSwitchComponent
    ],
    exports: [
        TimeZoneComboComponent,
        JqPluginDirective,
        DateRangePickerComponent,
        DatePickerComponent,
        TipsComponent,
        UploadPictureGalleryComponent,
        UploadPictureNoneGalleryComponent,
        BreadcrumbComponent,
        IndicatorDirective,
        EmptyPageComponent,
        MobileUploadPictureComponent,
        WangEditorComponent,
        MobileUploadPictureListComponent,
        ViewArtworkMasterComponent,
        QrCodeComponent,
        SendCodeComponent,
        LanguageSwitchComponent
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        }
    }
}
