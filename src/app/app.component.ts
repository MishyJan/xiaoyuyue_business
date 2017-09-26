import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { MobileSideBarComponent } from './shared/layout/mobile-side-bar/mobile-side-bar.component';
import { SidebarService } from 'shared/services/side-bar.service';
import { WeChatShareResultDto } from 'app/shared/utils/wechat-share-timeline.input.dto';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {
    toggleSidebarFlag = false;
    sidebarListShow: number;

    private viewContainerRef: ViewContainerRef;

    @ViewChild('mobileSideBarModel') mobileSideBarModel: MobileSideBarComponent;

    public constructor(
        injector: Injector,
        viewContainerRef: ViewContainerRef,
        private _sidebarService: SidebarService,
        private _weChatShareTimelineService: WeChatShareTimelineService
    ) {
        super(injector);
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
        this._sidebarService
            .toggleSidebarFlag.subscribe(flag => {
                this.toggleSidebarFlag = flag;
            })
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        App.init();
        App.initComponents();
        Layout.init();

        this.sidebarIsShow();
        this.initWechatShareConfig();
    }

    /**
     * 如果菜单栏为空就不 显示，并且把page-content宽度设置为100%
     */
    sidebarIsShow() {
        this.sidebarListShow = $('#sidebar .page-sidebar-menu').children().length;
        if (this.sidebarListShow < 1) {
            $('#sidebar').children().eq(0).css({
                width: 0
            })

            $('.page-content-wrapper .page-content').css({
                width: '100%',
                left: 0,
                paddingLeft: '20px',
                marginLeft: 0
            })
        }
    }

    initWechatShareConfig() {
        this._weChatShareTimelineService.input.sourceUrl = document.location.href;
        this._weChatShareTimelineService.input.title = this.l('ShareApp');
        this._weChatShareTimelineService.input.desc = this.l('Slogan');
        this._weChatShareTimelineService.input.imgUrl = AppConsts.appBaseUrl + '/assets/common/images/logo.jpg';
        this._weChatShareTimelineService.input.link = AppConsts.shareBaseUrl;

        this._weChatShareTimelineService.initWeChatShareConfig();
    }

    shareCallBack(result: WeChatShareResultDto) {
        if (result) {
            // 分享成功
        }
    }
}

