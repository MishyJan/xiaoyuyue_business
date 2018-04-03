import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManageComponent } from './account-manage.component';
import { AccountManagRoutingModule } from 'app/account-manage/account-manage.routing';
import { AppCommonModule } from 'app/shared/common/app-common.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { GridModule } from '@progress/kendo-angular-grid';
import { AccountListComponent } from 'app/account-manage/mobile-account-list/account-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule,
        GridModule,
        ModalModule.forRoot(),

        AccountManagRoutingModule
    ],
    declarations: [
        AccountManageComponent,
        AccountListComponent
    ]
})
export class AccountManageModule { }