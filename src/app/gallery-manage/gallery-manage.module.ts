import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryManageComponent } from './gallery-manage.component';
import { PictureListComponent } from './picture-list/picture-list.component';
import { GalleryManageRoutes } from './gallery-manage.routing';
import { AppCommonModule } from 'app/shared/common/app-common.module';

@NgModule({
    imports: [
        CommonModule,
        AppCommonModule,
        GalleryManageRoutes
    ],
    declarations: [
        GalleryManageComponent,
        PictureListComponent
    ]
})
export class GalleryManageModule { }