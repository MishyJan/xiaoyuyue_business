export class AppConsts {

    static readonly tenancyNamePlaceHolderInUrl = "{TENANCY_NAME}";

    static remoteServiceBaseUrl: string;
    static remoteServiceBaseUrlFormat: string;
    static appBaseUrl: string;
    static appBaseUrlFormat: string;
    static readonly externalLoginUrl = '/auth/login';
    
    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'Xiaoyuyue'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token'
    };

    static readonly grid = {
        defaultPageSize: 1,
        pageSizes: [5, 10, 20, 50, 100],
        maxPageSize:1000,
    }
}
