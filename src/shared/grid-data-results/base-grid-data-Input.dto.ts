import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { SortDescriptor } from '@progress/kendo-data-query';

export class BaseGridDataInputDto {
    CurrentPage = 1;
    ButtonCount = 5;
    Info = true;
    Type: 'numeric' | 'input' = 'numeric';
    PageSizes = false;
    PreviousNext = true;
    SkipCount = 0;
    MaxResultCount: number = AppConsts.grid.defaultPageSize;
    Sorting: Array<SortDescriptor> = [];
    Scrollable = 'none';
    Sortable = false;
    constructor(
        private sessionService: AppSessionService
    ) {
        this.init();
    }

    GetSortingString(): string {
        if (this.Sorting.length > 0 && this.Sorting[0].dir) {
            return this.Sorting[0].field + ' ' + this.Sorting[0].dir;
        } else {
            return '';
        }
    }

    private init(): void {
        const currentPage = localStorage.getItem(abp.utils.formatString(AppConsts.bookingorderListPageCache, this.sessionService.tenantId));
        if (!currentPage) {
            localStorage.setItem(abp.utils.formatString(AppConsts.bookingorderListPageCache, this.sessionService.tenantId), '0');
            this.CurrentPage = 1;
        } else {
            localStorage.setItem(abp.utils.formatString(AppConsts.bookingorderListPageCache, this.sessionService.tenantId), currentPage + '');
            this.CurrentPage = +currentPage;
        }
    }

    // 保存页码到localStorage中
    setPage(): void {
        localStorage.setItem(abp.utils.formatString(AppConsts.bookingorderListPageCache, this.sessionService.tenantId), this.CurrentPage + '');
    }
}


export class BaseLsitDataInputDto {

    MaxResultCount = 8;
    SkipCount = 0;
    Sorting: string;
    TotalItems = 0;
    CurrentPage = 0;
    constructor(
        private sessionService: AppSessionService
    ) {
        this.init();
    }

    private init(): void {
        const currentPage = localStorage.getItem(abp.utils.formatString(AppConsts.bookingListPageCache, this.sessionService.tenantId));
        if (!currentPage) {
            localStorage.setItem(abp.utils.formatString(AppConsts.bookingListPageCache, this.sessionService.tenantId), '0');
            this.CurrentPage = 0;
        } else {
            localStorage.setItem(abp.utils.formatString(AppConsts.bookingListPageCache, this.sessionService.tenantId), currentPage + '');
            this.CurrentPage = +currentPage;
        }
    }

    // 保存页码到localStorage中
    setPage(): void {
        localStorage.setItem(abp.utils.formatString(AppConsts.bookingListPageCache, this.sessionService.tenantId), this.CurrentPage + '');
    }
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
