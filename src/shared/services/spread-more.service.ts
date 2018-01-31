import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import * as localForage from 'localforage';
import { AppConsts } from 'shared/AppConsts';

export class SpreadMoreStatus {
    active: boolean;
    text: string;
}

export class SpreadMoreService {
    cacheName: string;
    tenantId: number;
    spreadMoreStatus: SpreadMoreStatus;
    constructor(cacheName: string, tenantId: number) {
        this.cacheName = cacheName;
        this.tenantId = tenantId;
        this.init();
    }

    public toggleStatus(): void {
        this.spreadMoreStatus.active = !this.spreadMoreStatus.active;
        this.spreadMoreStatus.active ? this.spread() : this.furl();
        localForage.setItem(abp.utils.formatString(this.cacheName, this.tenantId), this.spreadMoreStatus)
    }

    private init(): void {
        this.spreadMoreStatus = new SpreadMoreStatus();
        localForage.getItem(abp.utils.formatString(this.cacheName, this.tenantId))
            .then((result: SpreadMoreStatus) => {
                if (!result) {
                    this.spreadMoreStatus = new SpreadMoreStatus();
                    this.furl();
                    localForage.setItem(abp.utils.formatString(this.cacheName, this.tenantId), this.spreadMoreStatus)
                    return;
                }
                this.spreadMoreStatus = result;
            })
    }

    // 收起
    private spread(): void {
        this.spreadMoreStatus.active = true;
    }

    // 展开
    private furl(): void {
        this.spreadMoreStatus.active = false;
    }
}
