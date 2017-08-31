import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

import { AngularEchartsModule } from 'ngx-echarts';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid/dist/es/grid.module';
import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from 'app/notifications/notifications-routing.module';
import { SharedModule } from '@progress/kendo-angular-grid/dist/es/shared.module';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        NotificationsRoutingModule,
        DropDownsModule,
        GridModule,
        DropDownsModule,
        ButtonsModule,
        SharedModule,
        DialogModule,
        DateInputModule,
    ],
    declarations: [
        NotificationsComponent
    ]
})
export class NotificationsModule { }