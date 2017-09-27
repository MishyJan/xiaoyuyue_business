// 设置进入页面的启动加载页面，替换Abp框架的Loading动画
// tslint:disable-next-line:class-name
export class appLoadingBusy {
    static effectText = '小预约 知未来';
    static setBusy(): void {
        let bodyEle = $('body');
        let effectTextWrap = $('<div></div>').addClass('effect-text-wrap').text(appLoadingBusy.effectText);
        let loadingAniWrap = $('<div></div>').addClass('loading-wrap');
        let loadingSpinner = $('<div class="spinner"><i></i></div>');
        let imgLogo = $('<img>').addClass('logo').attr('src', '/assets/common/images/login/logo-colorized.png');
        imgLogo.attr('width', '96px');
        let appLoadingBusyWrap = $('<div></div>').addClass('app-loading-busy-wrap');

        bodyEle.append(appLoadingBusyWrap);
        appLoadingBusyWrap.append(imgLogo);
        appLoadingBusyWrap.append(effectTextWrap);
        appLoadingBusyWrap.append(loadingAniWrap);
        loadingAniWrap.append(loadingSpinner);
    };

    static clearBusy(): void {
        $('.app-loading-busy-wrap').remove();
    };
};
