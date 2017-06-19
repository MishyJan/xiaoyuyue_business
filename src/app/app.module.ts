import { NgModule, APP_INITIALIZER } from '@angular/core';
import * as ngCommon from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AbpModule, ABP_HTTP_PROVIDER } from '@abp/abp.module';

import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

import { AppSessionService } from '@shared/common/session/app-session.service';

import { GridModule } from '@progress/kendo-angular-grid';
import { GridDataResultsModule } from '@shared/grid-data-results/grid-result.modules';

@NgModule({
    declarations: [
        AppComponent,
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
    ]
})
export class AppModule { }
