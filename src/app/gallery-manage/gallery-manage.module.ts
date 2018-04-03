import { AppCommonModule } from 'app/shared/common/app-common.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryManageRoutes } from './gallery-manage.routing';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { PictureListComponent } from './picture-list/picture-list.component';
import { TooltipModule } from 'ngx-bootstrap';
import { UtilsModule } from 'shared/utils/utils.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TooltipModule.forRoot(),
        AppCommonModule,
        GalleryManageRoutes,
        NgxPaginationModule,
        UtilsModule
    ],
    declarations: [
        PictureListComponent
    ]
})
export class GalleryManageModule { }