import * as ngCommon from '@angular/common';

import { ModuleWithProviders, NgModule } from '@angular/core';

import { AbpModule } from '@abp/abp.module';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { CommonModule } from '@shared/common/common.module';
import { DatePickerComponent } from './timing/date-picker.component';
import { DateRangePickerComponent } from './timing/date-range-picker.component';
import { FormsModule } from '@angular/forms';
import { JqPluginDirective } from './libs/jq-plugin.directive';
import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { TipsComponent } from './tips/tips.component';
import { UploadPicDirective } from './upload-picture/upload-pic.directive';
import { UploadPictureGalleryComponent } from './upload-picture-gallery/upload-picture-gallery.component';
import { UploadPictureNoneGalleryComponent } from './upload-picture-none-gallery/upload-picture-none-gallery.component';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        AbpModule,
        CommonModule,
        NgxPaginationModule
    ],
    declarations: [
        TimeZoneComboComponent,
        JqPluginDirective,
        DateRangePickerComponent,
        DatePickerComponent,
        TipsComponent,
        UploadPictureGalleryComponent,
        UploadPictureNoneGalleryComponent,
        UploadPicDirective
    ],
    exports: [
        TimeZoneComboComponent,
        JqPluginDirective,
        UploadPicDirective,
        DateRangePickerComponent,
        DatePickerComponent,
        TipsComponent,
        UploadPictureGalleryComponent,
        UploadPictureNoneGalleryComponent,
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
