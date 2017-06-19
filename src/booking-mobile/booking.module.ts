import * as ngCommon from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { BookingRoutingModule } from "booking-mobile/booking-routing.module";
import { BookingComponent } from "booking-mobile/booking.component";
import { BookingAboutComponent } from "booking-mobile/about/booking-about.component";
import { BookingHeaderComponent } from "booking-mobile/layout/header/header.component";
import { BookingRatingComponent } from "booking-mobile/rating/booking-rating.component";
import { BookingTimeComponent } from "booking-mobile/time/booking-time.component";
import { BookingSideBarComponent } from "booking-mobile/layout/side-bar/side-bar.component";

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        BookingRoutingModule
    ],
    declarations: [
        BookingComponent,
        BookingHeaderComponent,
        BookingSideBarComponent,
        BookingAboutComponent,
        BookingTimeComponent,
        BookingRatingComponent
    ],
    providers: [
    ]
})
export class BookingModule {

}