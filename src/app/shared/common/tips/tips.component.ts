import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';

@Component({
    selector: 'xiaoyuyue-tips',
    templateUrl: './tips.component.html',
    styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {
    constructor(
        private _router: Router
    ) { }

    ngOnInit() {
    }

    completeOrgInfo(): void {
        this._router.navigate(['/organization/info']);
    }
}