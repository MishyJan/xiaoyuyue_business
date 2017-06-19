import { Component, OnInit, Injector, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, Injectable } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { NotificationServiceProxy, GetNotificationsOutput, UserNotification, State } from '@shared/service-proxies/service-proxies';
import { UserNotificationHelper, IFormattedUserNotification } from './UserNotificationHelper';
import { appModuleAnimation } from '@shared/animations/routerTransition';

import { AppConsts } from '@shared/AppConsts';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, SortDescriptor, orderBy, toODataString } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { AppGridData } from "shared/grid-data-results/grid-data-results";
import { Observable } from "rxjs/Observable";
import { AppUserNotificationState } from "shared/AppEnums";

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class NotificationsComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('table') table: ElementRef;
    private _$table: JQuery;

    notificationsData: AppGridData = new AppGridData();
    readStateFilter: string = 'ALL';
    loading: boolean = false;

    buttonCount: number = 5;
    info: boolean = true;
    type: 'numeric';
    pageSizes: number[] = AppConsts.grid.pageSizes;
    previousNext: boolean = true;
    pageSize: number = 5;
    skip: number = 0;

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
        let state = { skip: this.skip, take: this.pageSize };
        let maxResultCount, skipCount, sorting;
        let filter = this.readStateFilter === 'ALL' ? undefined : AppUserNotificationState.Unread;
        if (state) {
            maxResultCount = state.take;
            skipCount = state.skip
        }

        let loadNotificationsData = () => {
            var result = this._notificationService.getUserNotifications(filter, maxResultCount, skipCount).map((response) => {
                let dataResult = (<GridDataResult>{
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
            var btn = $('#' + dataItem.id);
            btn.find('i').removeClass('fa-envelope').addClass('fa-envelope-open');
            btn.attr('disabled', 'disabled');
        });
    }

}