import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppConsts } from 'shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-create-succeeded',
    templateUrl: './create-succeeded.component.html',
    styleUrls: ['./create-succeeded.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateSucceededComponent implements OnInit {
    shareUrl: string;
    bookingId: string;

    constructor(
        private _route: ActivatedRoute

    ) { }

    ngOnInit() {
        this.bookingId = this._route.snapshot.paramMap.get('id');
        this.shareUrl = AppConsts.shareBaseUrl + '/booking/' + this.bookingId;
    }

}
