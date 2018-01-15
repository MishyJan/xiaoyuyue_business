import { AppConsts } from '@shared/AppConsts';
import { SortDescriptor } from '@progress/kendo-data-query';

export class BaseGridDataInputDto {
    ButtonCount = 5;
    Info = true;
    Type: 'numeric' | 'input' = 'numeric';
    PageSizes = true;
    PreviousNext = true;
    SkipCount = 0;
    MaxResultCount: number = AppConsts.grid.defaultPageSize;
    Sorting: Array<SortDescriptor> = [];
    Scrollable = 'none';
    Sortable = false;
    constructor(buttonCount = 5, pageSizes = false, previousNext = true, info = true, scrollable = 'none', sortable = false) {
        this.ButtonCount = buttonCount;
        this.PageSizes = pageSizes;
        this.PreviousNext = previousNext;
        this.Info = info;
        this.Scrollable = scrollable;
        this.Sortable = sortable;
    }

    GetSortingString(): string {
        if (this.Sorting.length > 0 && this.Sorting[0].dir) {
            return this.Sorting[0].field + ' ' + this.Sorting[0].dir;
        } else {
            return '';
        }
    }
}


export class BaseLsitDataInputDto {
    MaxResultCount: number = 8;
    SkipCount = 0;
    Sorting: string;
    TotalItems = 0;
    CurrentPage = 0;
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
