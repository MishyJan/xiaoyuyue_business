import * as ApiServiceProxies from './service-proxies';

import { NgModule } from '@angular/core';

@NgModule({
    providers: [
        ApiServiceProxies.LanguageServiceProxy,
        ApiServiceProxies.NotificationServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.ProfileServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.TimingServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.UserLoginServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.TenantRegistrationServiceProxy,
        ApiServiceProxies.OrgBookingOrderServiceProxy,
        ApiServiceProxies.BookingDataStatisticsServiceProxy,
        ApiServiceProxies.TenantInfoServiceProxy,
        ApiServiceProxies.OutletServiceServiceProxy,
        ApiServiceProxies.OrgBookingServiceProxy,
        ApiServiceProxies.PictureServiceProxy,
        ApiServiceProxies.StateServiceServiceProxy,
        ApiServiceProxies.SMSServiceProxy,
        ApiServiceProxies.BookingRecordServiceProxy,
        ApiServiceProxies.WeChatJSServiceProxy
    ]
})
export class ServiceProxyModule { }
