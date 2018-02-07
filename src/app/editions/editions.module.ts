import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from 'app/shared/common/app-common.module';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { EditionsRoutingModule } from 'app/editions/editions.routing';
import { EditionsListComponent } from 'app/editions/list/editions-list.component';
import { ToPayModelComponent } from 'app/editions/list/to-pay-model/to-pay-model.component';
import { ResponsiveModule } from 'ng2-responsive';
import { ToPayMobileComponent } from 'app/editions/list/to-pay-mobile/to-pay-mobile.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),

        ResponsiveModule,
        EditionsRoutingModule
    ],
    declarations: [
        EditionsListComponent,
        ToPayModelComponent,
        ToPayMobileComponent
    ]
})
export class EditionsModule { }