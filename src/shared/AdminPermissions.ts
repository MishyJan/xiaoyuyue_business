export class AdminPermissions {
    static readonly permissionName:string ="Admin";
        
    static readonly tenantDashboard ="Admin.Tenant.Dashboard";

    static readonly userManage = "Admin.UserManage";

    static readonly userManage_Tenants = "Admin.UserManage.Tenants";
    static readonly userManage_TenantsCreate = "Admin.UserManage.Tenants.Create";
    static readonly userManage_TenantsEdit = "Admin.UserManage.Tenants.Edit";
    static readonly userManage_TenantsDelete = "Admin.UserManage.Tenants.Delete";
    static readonly userManage_TenantsChangeFeatures= "Admin.UserManage.Tenants.ChangeFeatures";
    static readonly userManage_TenantsImpersonation= "Admin.UserManage.Tenants.Impersonation";
    
    static readonly userManage_Roles = "Admin.UserManage.Roles";
    static readonly userManage_RolesCreate = "Admin.UserManage.Roles.Create";
    static readonly userManage_RolesEdit = "Admin.UserManage.Roles.Edit";
    static readonly userManage_RolesDelete = "Admin.UserManage.Roles.Delete";

    static readonly userManage_Users = "Admin.UserManage.Users";
    static readonly userManage_UsersCreate = "Admin.UserManage.Users.Create";
    static readonly userManage_UsersEdit = "Admin.UserManage.Users.Edit";
    static readonly userManage_UsersDelete = "Admin.UserManage.Users.Delete";
    static readonly userManage_UsersChangePermissions = "Admin.UserManage.Users.ChangePermissions";
    static readonly userManage_UsersImpersonation = "Admin.UserManage.Users.Impersonation";
    
    static readonly userManage_OrganizationUnits = "Admin.UserManage.OrganizationUnits";
    static readonly userManage_OrganizationUnits_ManageOrganizationTree = "Admin.UserManage.OrganizationUnits.ManageOrganizationTree";
    static readonly userManage_OrganizationUnits_ManageMembers = "Admin.UserManage.OrganizationUnits.ManageMembers";

    static readonly configuration = "Admin.Configuration";
    static readonly configuration_Languages = "Admin.Configuration.Languages";
    static readonly configuration_LanguagesCreate = "Admin.Configuration.Languages.Create";
    static readonly configuration_LanguagesEdit = "Admin.Configuration.Languages.Edit";
    static readonly configuration_LanguagesDelete = "Admin.Configuration.Languages.Delete";
    static readonly configuration_LanguagesChangeTexts = "Admin.Configuration.Languages.ChangeTexts";
    
    static readonly configuration_TenantSettings = "Admin.Configuration.Tenant.Settings";
    static readonly configuration_HostSettings = "Admin.Configuration.Host.Settings";


    static readonly system = "Admin.System";
    static readonly system_AuditLogs = "Admin.System";
    static readonly system_HostMaintenance = "Admin.System.Host.Maintenance";
    static readonly system_HangfireDashboard = "Admin.System.HangfireDashboard";

    static readonly system_Editions = "Admin.System.Editions";
    static readonly system_EditionsCreate = "Admin.System.Editions.Create";
    static readonly system_EditionsEdit = "Admin.System.Editions.Edit";
    static readonly system_EditionsDelete = "Admin.System.Editions.Delete";

    static readonly content = "Admin.ContentManage";
    static readonly content_SmsTemplates = "Admin.ContentManage.SmsTemplates";
    static readonly content_SmsTemplatesCreate = "Admin.ContentManage.SmsTemplates.Create";
    static readonly content_SmsTemplatesEdit = "Admin.ContentManage.SmsTemplates.Edit";
    static readonly content_SmsTemplatesDelete = "Admin.ContentManage.SmsTemplates.Delete";
}
