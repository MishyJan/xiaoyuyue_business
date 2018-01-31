import { Component, EventEmitter, Input, OnInit, Output, Injector } from '@angular/core';

import { Router } from '@angular/router';
import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
    selector: 'xiaoyuyue-tips',
    templateUrl: './tips.component.html',
    styleUrls: ['./tips.component.scss']
})
export class TipsComponent extends AppComponentBase implements OnInit {

    @Input() slogen: string;
    @Input() redirectRoute: string;

    constructor(
        private injector: Injector,
        private _router: Router
    ) {
        super(injector);
 }

    ngOnInit() {
    }

    complete(): void {
        this._router.navigate([this.redirectRoute]);
        // this._router.navigate(['/organization/info']);
    }
}