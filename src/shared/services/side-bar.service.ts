import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SidebarService {
    public toggleSidebarFlag: EventEmitter<boolean>;
    constructor() {
        this.toggleSidebarFlag = new EventEmitter();
    }
}