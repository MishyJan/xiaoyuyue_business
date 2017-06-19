import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: 'auth/auth.module#AuthModule', //Lazy load account module
        data: { preload: true }
    },
    {
    path: 'mobile',
    loadChildren: 'booking-mobile/booking.module#BookingModule', //Lazy load account module
    data: { preload: true }
    }    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }