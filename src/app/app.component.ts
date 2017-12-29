import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ClientTypeHelper } from 'shared/helpers/ClientTypeHelper';
import { Meta } from '@angular/platform-browser';
import { MobileSideBarComponent } from './shared/layout/mobile-side-bar/mobile-side-bar.component';
import { SidebarService } from 'shared/services/side-bar.service';
import { WeChatShareResultDto } from 'app/shared/utils/wechat-share-timeline.input.dto';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';
import { device } from 'device.js';

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {
    isOldBroFlag = false;
    toggleSidebarFlag = false;
    sidebarListShow: number;

    private viewContainerRef: ViewContainerRef;

    @ViewChild('mobileSideBarModel') mobileSideBarModel: MobileSideBarComponent;

    public constructor(
        injector: Injector,
        viewContainerRef: ViewContainerRef,
        private _sidebarService: SidebarService,
        private _weChatShareTimelineService: WeChatShareTimelineService,
        private meta: Meta
    ) {
        super(injector);
        this.meta.updateTag({ name: 'generator', content: this.l('MetaGenerator') });
        this.meta.updateTag({ name: 'keywords', content: this.l('MetaKey') });
        this.meta.updateTag({ name: 'description', content: this.l('MetaDescription') });
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
        this._sidebarService
            .toggleSidebarFlag.subscribe(flag => {
                this.toggleSidebarFlag = flag;
            });
    }

    ngOnInit(): void {
        this.isOldBrowser();
        window.addEventListener('scroll', () => {
            this.isScrollToBottom();
        });
    }

    ngAfterViewInit(): void {
        App.init();
        App.initComponents();
        Layout.init();

        this.sidebarIsShow();
        this.softKeyboardBug();
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
        if (this.isWeiXin()) {
            this._weChatShareTimelineService.input.sourceUrl = document.location.href;
            this._weChatShareTimelineService.input.title = this.l('ShareApp');
            this._weChatShareTimelineService.input.desc = this.l('Slogan');
            this._weChatShareTimelineService.input.imgUrl = AppConsts.appBaseUrl + '/assets/common/images/logo.jpg';
            this._weChatShareTimelineService.input.link = AppConsts.userCenterUrl;

            this._weChatShareTimelineService.initWeChatShareConfig();
        }
    }

    shareCallBack(result: WeChatShareResultDto) {
        if (result) {
            // 分享成功
        }
    }

    // 获取IE版本
    IEVersion(): any {
        const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
        const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
        const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
        const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
        if (isIE) {
            const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(userAgent);
            const fIEVersion = parseFloat(RegExp['$1']);
            if (fIEVersion === 7) {
                return 7;
            } else if (fIEVersion === 8) {
                return 8;
            } else if (fIEVersion === 9) {
                return 9;
            } else if (fIEVersion === 10) {
                return 10;
            } else {
                return 6; // IE版本<=7
            }
        } else if (isEdge) {
            return 'edge'; // edge
        } else if (isIE11) {
            return 11; // IE11
        } else {
            return -1; // 不是ie浏览器
        }
    }

    // 获取webkit版本
    webkitVersion(): number {
        const agent = navigator.userAgent.toLowerCase();
        if (/chrome\/(\d+\.\d)/i.test(agent)) {
            return +RegExp['\x241'];
        }
    }

    isOldBrowser(): void {
        if ((this.IEVersion() !== -1 && (this.IEVersion() < 10 || this.IEVersion() !== 'edge')) || this.webkitVersion() <= 49) {
            this.isOldBroFlag = true;
        } else {
            this.isOldBroFlag = false;
        }
    }

    hideTipOldBrowser(): void {
        this.isOldBroFlag = false;
    }

    isScrollToBottom() {
        if (window.scrollY > 0) {
            this.hideTipOldBrowser();
        }
    }

    // 解决安卓下软键盘弹出，挡住input以及footer被推上来
    softKeyboardBug(): void {
        if (device.android) {
            // 获取当前页面高度
            $(window).resize(function () {
                const winHeight = $(window).height();
                const thisHeight = $(this).height();
                if (winHeight - thisHeight > 50) {
                    // 当软键盘弹出，在这里面操作
                    $('.mobile-create-booking .next-step').hide();
                } else {
                    // 当软键盘收起，在此处操作
                    $('.mobile-create-booking .next-step').show();
                }
            });
            $('input[type="text"],input[type="password"],input[type="number"],textarea,.wangedit-container').on('click', function (event) {
                const eventPageY = event.pageY;
                const wrapHeight = $('.wrap').height();

                if ((wrapHeight - eventPageY) < (wrapHeight / 2)) {
                    $('.wrap').scrollTop((wrapHeight / 2) - (wrapHeight - eventPageY));
                }

                if ((wrapHeight - eventPageY) > (wrapHeight / 2)) {
                    $('.wrap').scrollTop((wrapHeight - eventPageY) - (wrapHeight / 2));
                }
            });
        }
    }
}

