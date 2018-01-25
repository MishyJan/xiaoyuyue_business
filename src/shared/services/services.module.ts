import { AccessRecordService } from 'shared/services/access-record.service';
import { BookingOrderStatusService } from 'shared/services/booking-order-status.service';
import { BreadcrumbService } from './bread-crumb.service';
import { CookiesService } from './cookies.service';
import { GetUserForEditService } from './get-user-info.service';
import { HostSettingService } from './get-host-settings.service';
import { ListScrollService } from 'shared/services/list-scroll.service';
import { NgModule } from '@angular/core';
import { SelectHelperService } from 'shared/services/select-helper.service';
import { SidebarService } from 'shared/services/side-bar.service';
import { TenantService } from './tenant.service';
import { TitleService } from 'shared/services/title.service';
import { UploadPictureService } from 'shared/services/upload-picture.service';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';

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
        SelectHelperService,
        ListScrollService,
        BookingOrderStatusService
    ]
})
export class ServicesModule { }
