import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Injectable, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetNotificationsOutput, NotificationServiceProxy, State, UserNotification } from '@shared/service-proxies/service-proxies';
import { IFormattedUserNotification, UserNotificationHelper } from 'app/shared/layout/notifications/UserNotificationHelper';
import { SortDescriptor, orderBy, process, toODataString } from '@progress/kendo-data-query';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { AppUserNotificationState } from 'shared/AppEnums';
import { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class NotificationsComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('table') table: ElementRef;
    private _$table: JQuery;

    notificationsData: AppGridData = new AppGridData();
    readStateFilter = 'ALL';
    loading = false;

    buttonCount = 5;
    info = true;
    type: 'numeric';
    pageSizes: number[] = AppConsts.grid.pageSizes;
    previousNext = true;
    pageSize = 5;
    skip = 0;

    constructor(
        injector: Injector,
        private _notificationService: NotificationServiceProxy,
        private _userNotificationHelper: UserNotificationHelper
    ) {
        super(injector);
    }

    public ngOnInit(): void {
        this.getNotifications();
    }

    ngAfterViewInit(): void {
    }

    getNotifications(): void {
        this.loadData();
    }

    getNotificationURL(formattedRecord): string {
        return formattedRecord.url ? formattedRecord.url : '';
    }

    getNotificationText(formattedRecord) {
        return abp.utils.truncateStringWithPostfix(formattedRecord.text, 120);
    }


    setAllNotificationsAsRead(): void {
        this._userNotificationHelper.setAllAsRead(() => {
            this.getNotifications();
        });
    }

    openNotificationSettingsModal(): void {
        this._userNotificationHelper.openSettingsModal();
    }

    setNotificationAsRead(userNotification: UserNotification, callback: () => void): void {
        this._userNotificationHelper
            .setAsRead(userNotification.id, () => {
                callback && callback();
            });
    }

    private getRowClass(formattedRecord: IFormattedUserNotification): string {
        return formattedRecord.state === 'READ' ? 'notification-read' : '';
    }

    public dataStateChange({ skip, take }: DataStateChangeEvent): void {
        this.skip = skip;
        this.pageSize = take;

        this.loadData();
    }

    private loadData(): void {
        // tslint:disable-next-line:prefer-const
        let maxResultCount, skipCount, sorting;

        const state = { skip: this.skip, take: this.pageSize };
        const filter = this.readStateFilter === 'ALL' ? undefined : AppUserNotificationState.Unread;
        if (state) {
            maxResultCount = state.take;
            skipCount = state.skip
        }

        const loadNotificationsData = () => {
            const result = this._notificationService.getUserNotifications(filter, maxResultCount, skipCount).map((response) => {
                const dataResult = (<GridDataResult>{
                    data: response.items.map(item => {
                        return ({
                            tenantId: item.id,
                            userId: item.userId,
                            state: item.state,
                            notification: item.notification,
                            id: item.id,
                            formattedRecord: this._userNotificationHelper.format(<any>item, false)
                        });
                    }),
                    total: response.totalCount
                });

                return dataResult;
            });

            return result;
        };

        this.notificationsData.query(loadNotificationsData, true);
    }


    // 编辑删除
    editHandler({ sender, rowIndex, dataItem }) {
        this.setNotificationAsRead(dataItem, () => {
            const btn = $('#' + dataItem.id);
            btn.find('i').removeClass('fa-envelope').addClass('fa-envelope-open');
            btn.attr('disabled', 'disabled');
        });
    }

}
