import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppCommonModule } from 'app/shared/common/app-common.module';
import { CommonModule } from '@angular/common';
import { ContactInfoComponent } from './create-or-edit-outlet/contact-info/contact-info.component';
import { CreateOrEditOutletComponent } from './create-or-edit-outlet/create-or-edit-outlet.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ModalModule, } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { OutletImageComponent } from './create-or-edit-outlet/outlet-image/outlet-image.component';
import { OutletListComponent } from './outlet-list.component';
import { OutletRoutingModule } from './outlet-routing.module';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        ModalModule.forRoot(),
        UtilsModule,
        NgxPaginationModule,

        AppCommonModule,
        OutletRoutingModule,

        DropDownsModule,
    ],
    declarations: [
        CreateOrEditOutletComponent,
        OutletListComponent,
        OutletImageComponent,
        ContactInfoComponent,
    ],
    providers: [

    ]
})
export class OutletModule { }