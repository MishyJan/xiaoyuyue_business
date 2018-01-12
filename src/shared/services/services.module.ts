import { AccessRecordService } from 'shared/services/access-record.service';
import { BreadcrumbService } from './bread-crumb.service';
import { CookiesService } from './cookies.service';
import { GetUserForEditService } from './get-user-info.service';
import { HostSettingService } from './get-host-settings.service';
import { NgModule } from '@angular/core';
import { SidebarService } from 'shared/services/side-bar.service';
import { TenantService } from './tenant.service';
import { TitleService } from 'shared/services/title.service';
import { UploadPictureService } from 'shared/services/upload-picture.service';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';
import { SelectHelperService } from 'shared/services/select-helper.service';

@NgModule({
    providers: [
        AccessRecordService,
        HostSettingService,
        GetUserForEditService,
        TenantService,
        BreadcrumbService,
        CookiesService,
        TitleService,
        SidebarService,
        WeChatShareTimelineService,
        UploadPictureService,
        SelectHelperService
    ]
})
export class ServicesModule { }
