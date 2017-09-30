import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';

@Component({
    selector: 'xiaoyuyue-tips',
    templateUrl: './tips.component.html',
    styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {

    @Input() slogen: string;
    @Input() redirectRoute: string;

    constructor(
        private _router: Router
    ) { }

    ngOnInit() {
    }

    complete(): void {
        this._router.navigate([this.redirectRoute]);
        // this._router.navigate(['/organization/info']);
    }
}