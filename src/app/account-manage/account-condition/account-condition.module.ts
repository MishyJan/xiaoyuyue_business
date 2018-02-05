import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from 'app/shared/common/app-common.module';
import { AccountConditionRoutingModule } from 'app/account-manage/account-condition/account-condition.routing';
import { AccountConditionComponent } from 'app/account-manage/account-condition/account-condition.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ResponsiveModule } from 'ng2-responsive';
import { TabsModule } from 'ngx-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule,
        GridModule,
        ResponsiveModule,
        TabsModule.forRoot(),

        AccountConditionRoutingModule
    ],
    declarations: [
        AccountConditionComponent
    ]
})
export class AccountConditionModule { }