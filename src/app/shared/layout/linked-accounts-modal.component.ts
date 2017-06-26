import { Component, OnInit, ViewChild, Injector, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';

import { UserLinkServiceProxy, LinkedUserDto, UnlinkUserInput } from '@shared/service-proxies/service-proxies';
import { LinkAccountModalComponent } from './link-account-modal.component';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';

import * as moment from "moment";

import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process, SortDescriptor, orderBy, toODataString } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppGridData } from "shared/grid-data-results/grid-data-results";

@Component({
    selector: 'linkedAccountsModal',
    templateUrl: './linked-accounts-modal.component.html'
})
export class LinkedAccountsModalComponent extends AppComponentBase implements AfterViewInit {

    @ViewChild('linkedAccountsModal') modal: ModalDirective;
    @ViewChild('linkAccountModal') linkAccountModal: LinkAccountModalComponent;

    @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

    private _$linkedAccountsTable: JQuery;

    // kendo grid
    LinkedAccountsData;
    buttonCount: number = 5;
    info: boolean = true;
    type: 'numeric' | 'input' = 'numeric';
    pageSizes: number[] = AppConsts.grid.pageSizes;
    previousNext: boolean = true;
    pageSize: number = AppConsts.grid.defaultPageSize;
    skip: number = 0;
    sort: Array<SortDescriptor> = [];

    constructor(
        injector: Injector,
        private abpMultiTenancyService: AbpMultiTenancyService,
        private _userLinkService: UserLinkServiceProxy,
        private _linkedAccountService: LinkedAccountService,
        private _linkedAccountsGridDataResult: AppGridData
    ) {
        super(injector);
    }

    ngAfterViewInit(): void {
        this.LinkedAccountsData = this._linkedAccountsGridDataResult;
        this.loadData();
    }

    // 获取itemName
    getShownLinkedUserName(linkedUser: LinkedUserDto): string {
        if (!this.abpMultiTenancyService.isEnabled) {
            return linkedUser.username;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : ".") + "\\" + linkedUser.username;
    }

    deleteLinkedUser(linkedUser: LinkedUserDto): void {
        this.message.confirm(
            this.l('LinkedUserDeleteWarningMessage', linkedUser.username),
            isConfirmed => {
                if (isConfirmed) {
                    let unlinkUserInput = new UnlinkUserInput();
                    unlinkUserInput.userId = linkedUser.id;
                    unlinkUserInput.tenantId = linkedUser.tenantId;

                    this._userLinkService.unlinkUser(unlinkUserInput).subscribe(() => {
                        this.getLinkedUsers();
                        this.notify.success(this.l('SuccessfullyUnlinked'));
                    });
                }
            }
        );
    }

    getLinkedUsers(): void {
        this.loadData();
    }

    manageLinkedAccounts(): void {
        this.linkAccountModal.show();
    }

    switchToUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    show(): void {
        this.modal.show();
        this.getLinkedUsers();
    }

    close(): void {
        this.modal.hide();
        this.modalClose.emit(null);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.skip = skip;
        this.pageSize = take;
        this.sort = sort;

        this.loadData();
    }

    private loadData(): void {
        let state = { skip: this.skip, take: this.pageSize, sort: this.sort };
        let maxResultCount, skipCount, sorting;
        if (state) {
            maxResultCount = state.take;
            skipCount = state.skip
            if (state.sort.length > 0 && state.sort[0].dir) {
                sorting = state.sort[0].field + " " + state.sort[0].dir
            }
        }

        let loadLinkedData = () => {
            return this._userLinkService
                .getLinkedUsers(sorting, maxResultCount, skipCount);
        };
        this._linkedAccountsGridDataResult.query(loadLinkedData);
    }

    login(item): void {
        this.switchToUser(item);
    }

    remove(item): void {
        this.deleteLinkedUser(item);
    }
}