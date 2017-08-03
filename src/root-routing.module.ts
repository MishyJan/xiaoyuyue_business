import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalLoginGuard } from 'app/shared/common/auth/external-login-guard';

const routes: Routes = [
    { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' },
    {
        path: 'auth',
        loadChildren: 'auth/auth.module#AuthModule', //Lazy load account module
        data: { preload: true }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }