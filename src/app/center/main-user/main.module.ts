import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainRoutingModule } from "app/center/main-user/main-routing.module";
import { MainUserComponent } from "app/center/main-user/main-user.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MainRoutingModule,
    ],
    declarations: [
        MainUserComponent
    ]
})
export class MainModule { }