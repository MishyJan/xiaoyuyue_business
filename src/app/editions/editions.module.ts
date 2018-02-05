import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from 'app/shared/common/app-common.module';
import { ModalModule } from 'ngx-bootstrap';
import { EditionsRoutingModule } from 'app/editions/editions.routing';
import { EditionsListComponent } from 'app/editions/list/editions-list.component';
import { ToPayModelComponent } from 'app/editions/list/to-pay-model/to-pay-model.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule,
        ModalModule.forRoot(),

        EditionsRoutingModule
    ],
    declarations: [
        EditionsListComponent,
        ToPayModelComponent
    ]
})
export class EditionsModule { }