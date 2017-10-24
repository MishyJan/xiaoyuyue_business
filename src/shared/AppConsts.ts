import { state } from '@angular/core';

export class AppConsts {

    static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';
    static remoteServiceBaseUrl: string;
    static remoteServiceBaseUrlFormat: string;

    static appBaseUrl: string;
    static shareBaseUrl: string;
    static appBaseUrlFormat: string;
    static readonly externalLoginUrl = '/auth/external';
    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        commonLocalizationSourceName: 'Xiaoyuyue',
        defaultLocalizationSourceName: 'BusinessCenter'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token'
    };

    static readonly grid = {
        defaultPageSize: 10,
        pageSizes: [5, 10, 20, 50, 100],
        maxPageSize: 1000,
    };

    static readonly accessRecord = {
        bookings: 'access_bookings'
    };

    static outletSelectListCache = 'OutletSelectListCache-{0}';

    static bookingSelectListCache = 'BookingSelectListCache-{0}';
}

export class MediaCompressFormat {
    static bookingListFormat = 'imageView2/2/w/600/q/100|imageslim';
    static bookingInfoFormat = 'imageView2/2/w/800/q/100|imageslim';
    static outletListFormat = 'imageView2/2/w/600/q/100|imageslim';
    static outletInfoFormat = 'imageView2/2/w/800/q/100|imageslim';
    static contactorFormat = 'imageView2/2/w/400/q/100|imageslim';
    static minProfilePictureFormat = 'imageView2/2/w/100/q/100|imageslim';
}