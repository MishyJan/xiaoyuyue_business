/* 本地代理测试，微信授权调试等 */
// export class AppConfig {
//     public static readonly RemoteServiceBaseUrl = 'http://vappshk.oicp.net:9090';
//     public static readonly AppBaseUrl = 'http://business.xiaoyuyue.com';
//     public static readonly UserCenterUrl = 'http://www.xiaoyuyue.com';
//     public static readonly BusinessCenterUrl = 'http://business.xiaoyuyue.com';
// }

/* 本地开发 */
export class AppConfig {
    public static readonly RemoteServiceBaseUrl = 'http://vappshk.oicp.net:9090';
    public static readonly AppBaseUrl = 'http://localhost:5202';
    public static readonly UserCenterUrl = 'http://localhost:5201';
    public static readonly BusinessCenterUrl = 'http://localhost:5202';
}

/* 推送develop分支 */
// export class AppConfig {
//     public static readonly RemoteServiceBaseUrl = 'http://vappshk.oicp.net:9090';
//     public static readonly AppBaseUrl = 'http://vappshk.oicp.net:5202';
//     public static readonly UserCenterUrl = 'hhttp://vappshk.oicp.net:5201';
//     public static readonly BusinessCenterUrl = 'http://vappshk.oicp.net:5202';
// }
