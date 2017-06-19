import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookingManageComponent } from "app/booking/booking-manage/booking-manage.component";
import { MainRoutingModule } from "app/booking/booking-manage/main-routing.module";

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