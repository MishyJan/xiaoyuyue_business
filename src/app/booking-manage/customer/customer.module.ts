import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { ModalModule, PopoverModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

import { AppCommonModule } from 'app/shared/common/app-common.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { CustomerInfoModelComponent } from './info-model/customer-info-model.component';
import { CustomerListComponent } from './customer-list.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { QRCodeModule } from 'angular2-qrcode';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),

        CustomerRoutingModule,
        UtilsModule,
        AppCommonModule,
        GridModule,
        DropDownsModule,
        ButtonsModule,
        DialogModule,
        DateInputModule,
    ],
    declarations: [
        CustomerListComponent,
        CustomerInfoModelComponent,
    ],
    providers: [

    ]
})
export class CustomerModule { }