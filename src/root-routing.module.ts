import { RouterModule, Routes } from '@angular/router';

import { ExternalLoginGuard } from 'app/shared/common/auth/external-login-guard';
import { NgModule } from '@angular/core';

const routes: Routes = [

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }