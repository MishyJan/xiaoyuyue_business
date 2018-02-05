import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManageComponent } from './account-manage.component';
import { AccountManagRoutingModule } from 'app/account-manage/account-manage.routing';
import { AccountConditionComponent } from './account-condition/account-condition.component';
import { AppCommonModule } from 'app/shared/common/app-common.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppCommonModule,
    GridModule,
    ModalModule.forRoot(),

    AccountManagRoutingModule
  ],
  declarations: [AccountManageComponent,
    AccountConditionComponent
]
})
export class AccountManageModule { }