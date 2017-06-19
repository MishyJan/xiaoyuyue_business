export class BaseGridDataInputDto {
    maxResultCount: number;
    skipCount: number;
    sorting: string;
}

export class UserGridDataInputDto extends BaseGridDataInputDto {
    Permission: string;
    RoleIds: number[];
    UserName: string;
    Surname: string;
    Email: string;
    IsEmailConfirmed: boolean;
    PhoneNumber: string;
    IsPhoneConfirmed: boolean;
    IsActive: boolean;
}

export class LanguageTextGridDataInputDto extends BaseGridDataInputDto {
    targetLanguageName: string;
    sourceName: string;
    baseLanguageName: string;
    targetValueFilter: string;
    filterText: string;
}

export class LogsGridDataInputDto extends BaseGridDataInputDto {
    startDate: any;
    endDate: any;
    userName: string;
    serviceName: string;
    methodName: string;
    browserInfo: string;
    hasException: boolean;
    minExecutionDuration: number;
    maxExecutionDuration: number;
}