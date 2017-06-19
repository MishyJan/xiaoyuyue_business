import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainRoutingModule } from "app/center/booking-manage/main-routing.module";
import { BookingManageComponent } from "app/center/booking-manage/booking-manage.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MainRoutingModule,
    ],
    declarations: [
        BookingManageComponent
    ]
})
export class MainModule { }