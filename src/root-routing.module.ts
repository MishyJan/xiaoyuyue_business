import { RouterModule, Routes } from '@angular/router';

import { ExternalLoginGuard } from 'app/shared/common/auth/external-login-guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: 'app/auth/auth.module#AuthModule', // Lazy load account module
        data: { preload: true }
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }