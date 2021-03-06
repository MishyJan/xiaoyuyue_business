import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { ClientTypeHelper } from 'shared/helpers/ClientTypeHelper';
import { FeedbackComponent } from './feedback/feedback.component';
import { NgModule } from '@angular/core';
import { SupportedBrowsersComponent } from 'app/shared/layout/supported-browsers/supported-browsers.component';
import { PageNotFoundComponent } from 'app/shared/layout/page-not-found/page-not-found.component';
import { InitLanguage, AppConsts } from 'shared/AppConsts';
import { CookiesService } from 'shared/services/cookies.service';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                data: { breadcrumb: 'Home' },
                children: [
                    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
                    {
                        path: 'feedback',
                        loadChildren: 'app/feedback/feedback.module#FeedbackModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'account',
                        loadChildren: 'app/account-manage/account-manage.module#AccountManageModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'editions',
                        loadChildren: 'app/editions/editions.module#EditionsModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'notifications',
                        loadChildren: 'app/notifications/notifications.module#NotificationsModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'dashboard',
                        loadChildren: 'app/dashboard/dashboard.module#DashboardModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'booking',
                        loadChildren: 'app/booking-manage/booking/booking.module#BookingModule', // Lazy load booking module
                        data: { preload: true }
                    },
                    {
                        path: 'bookingorder',
                        loadChildren: 'app/booking-manage/booking-order/booking-order.module#BookingOrderModule', // Lazy load booking order module
                        data: { preload: true }
                    },
                    {
                        path: 'organization',
                        loadChildren: 'app/organization-manage/org-info/organization.modules#OrganizationModule', // Lazy load admin module
                        data: { preload: true }
                    },
                    {
                        path: 'outlet',
                        loadChildren: 'app/organization-manage/outlet/outlet.modules#OutletModule', // Lazy load admin module
                        data: { preload: true }
                    },
                    {
                        path: 'gallery-manage',
                        loadChildren: 'app/gallery-manage/gallery-manage.module#GalleryManageModule', // Lazy load admin module
                        data: { preload: true }
                    }
                ]
            },
            {
                path: 'auth',
                loadChildren: 'app/auth/auth.module#AuthModule', // Lazy load account module
                data: { preload: true }
            },
            {
                path: 'supported-browsers',
                component: SupportedBrowsersComponent
            },
            { path: '**', component: PageNotFoundComponent }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor(
        private router: Router,
        private _cookiesService: CookiesService
    ) {
        router.events.subscribe((event: NavigationEnd) => {
            if (!(event instanceof NavigationEnd)) { return; }
            // TODO: 软键盘推出处理input输入框居中在页面中的bug
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
            setTimeout(() => {
                this.resetYAxial();
                this.toggleBodyCssClass();
            }, 0);
            this.initLanguage(event);
        });
    }

    resetYAxial(): void {
        $('html,body').animate({ 'scrollTop': 0 });
    }


    toggleBodyCssClass(): void {
        if (ClientTypeHelper.isWeChatMiniProgram) {
            $('.mobile-page-content').css('top', '0px');
            $('.mobile-page-content').css('height', '100vh');
        }
    }

    initLanguage(event: NavigationEnd): void {
        if (event.url === '/') { return; }
        InitLanguage.all.forEach((langName: string) => {
            let url = event.url;
            url = url.replace(/\//, '');
            const value = langName.toLocaleLowerCase().indexOf(url.toLocaleLowerCase());
            if (value < 0) { return; }
            this.changeLanguage(langName);
        });
    }

    changeLanguage(langName: string) {
        this._cookiesService.setCookieValue(
            'Abp.Localization.CultureName',
            langName,
            new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
            abp.appPath
        );
        window.location.href = AppConsts.appBaseUrl;
    }
}