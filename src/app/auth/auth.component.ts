import { AfterViewInit, Component, Injector, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { LoginService } from 'shared/services/login.service';
import { WeChatShareResultDto } from 'app/shared/utils/wechat-share-timeline.input.dto';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';

@Component({
    templateUrl: './auth.component.html',
    styleUrls: [
        './auth.component.scss',
    ],
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent extends AppComponentBase implements OnInit, AfterViewInit {

    private viewContainerRef: ViewContainerRef;

    currentYear: number = moment().year();
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    public constructor(
        injector: Injector,
        private _loginService: LoginService,
        private _weChatShareTimelineService: WeChatShareTimelineService,
        viewContainerRef: ViewContainerRef,
    ) {
        super(injector);

        this.viewContainerRef = viewContainerRef; // We need this small hack in order to catch application root view container ref for modals
    }

    showTenantChange(): boolean {
        return abp.multiTenancy.isEnabled && !this.supportsTenancyNameInUrl();
    }

    ngOnInit(): void {
        this._loginService.init();
        $('body').attr('class', 'page-md login');
    }

    ngAfterViewInit(): void {
        this.initWechatShareConfig();
    }

    private supportsTenancyNameInUrl() {
        return (AppConsts.appBaseUrlFormat && AppConsts.appBaseUrlFormat.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) >= 0);
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
