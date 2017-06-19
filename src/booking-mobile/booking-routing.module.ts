import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookingComponent } from "booking-mobile/booking.component";
import { BookingAboutComponent } from "booking-mobile/about/booking-about.component";
import { BookingTimeComponent } from "booking-mobile/time/booking-time.component";
import { BookingRatingComponent } from "booking-mobile/rating/booking-rating.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: BookingComponent,
                children: [
                    { path: '', redirectTo: 'about' },
                    { path: 'about', component: BookingAboutComponent},
                    { path: 'time', component: BookingTimeComponent},
                    { path: 'rating', component: BookingRatingComponent}
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class BookingRoutingModule { }