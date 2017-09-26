import { ActivatedRouteSnapshot, Event, NavigationEnd, Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';
import { WeChatShareInputDto, WeChatShareResultDto } from 'app/shared/utils/wechat-share-timeline.input.dto';

import { AppServiceBase } from 'shared/services/base.service';
import { RandomHelper } from 'shared/helpers/RandomHelper';
import { TitleService } from 'shared/services/title.service';
import { WeChatJSServiceProxy } from 'shared/service-proxies/service-proxies';

export declare class Breadcrumb {
    displayName: string;
    terminal: boolean;
    url: string;
}

@Injectable()
export class WeChatShareTimelineService {
    successAction = new EventEmitter<WeChatShareResultDto>();
    input: WeChatShareInputDto = new WeChatShareInputDto();
    result: WeChatShareResultDto = new WeChatShareResultDto();
    constructor(
        private _wechatJSService: WeChatJSServiceProxy) {
    }

    initWeChatShareConfig() {
        this.result.shareUrl = this.input.sourceUrl;
        this.result.target = 'WeChat';
        const nonceStr = RandomHelper.randomString(10);
        const timestamp = moment().unix();
        const self = this;
        self._wechatJSService.getJsApiSignature(self.input.sourceUrl, nonceStr, timestamp).subscribe(result => {
            wx.config({
                appId: result.appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: result.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage',]
            });

            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: self.input.title, // 分享标题
                    link: self.input.link, // 分享链接
                    imgUrl: self.input.imgUrl, // 分享图标
                    trigger: function (res) {
                        // alert("点击分享：" +JSON.stringify(res));
                        // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口
                    },
                    success: function () {
                        self.result.result = true;
                        self.successAction.emit(self.result);
                        // 接口调用成功时执行的回调函数
                    },
                    cancel: function () {
                        self.result.result = false;
                        self.successAction.emit(self.result);
                        // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
                    },
                    complete: function () {
                        // 接口调用完成时执行的回调函数，无论成功或失败都会执行
                    }
                });
                wx.onMenuShareAppMessage({
                    title: self.input.title, // 分享标题
                    desc: self.input.desc, // 分享描述
                    link: self.input.link, // / 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: self.input.imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        self.result.result = true;
                        self.successAction.emit(self.result);
                        // 接口调用成功时执行的回调函数
                    },
                    cancel: function () {
                        self.result.result = false;
                        self.successAction.emit(self.result);
                        // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
                    },
                    complete: function () {
                        // 接口调用完成时执行的回调函数，无论成功或失败都会执行
                    }
                });
            });
        });
    }

    private isWeiXin() {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) + '' == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }
}