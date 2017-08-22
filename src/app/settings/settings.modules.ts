import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { ModalModule, PopoverModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

import { AppCommonModule } from 'app/shared/common/app-common.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SettingsRoutingModule } from './settings-routing.module';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        ModalModule.forRoot(),
        UtilsModule,

        AppCommonModule,
        SettingsRoutingModule,
    ],
    declarations: [
    ],
    providers: [

    ]
})
export class SettingsModule { }