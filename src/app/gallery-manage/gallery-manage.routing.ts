import { Routes, RouterModule } from '@angular/router';
import { PictureListComponent } from './picture-list/picture-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '', redirectTo: 'list'
            },
            {
                path: 'list',
                component: PictureListComponent,
                data: { breadcrumb: 'PictureGallery' }
            }
        ]
    },
];

export const GalleryManageRoutes = RouterModule.forChild(routes);
