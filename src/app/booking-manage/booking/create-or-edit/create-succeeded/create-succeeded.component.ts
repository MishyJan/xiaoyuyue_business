import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-create-succeeded',
    templateUrl: './create-succeeded.component.html',
    styleUrls: ['./create-succeeded.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateSucceededComponent extends AppComponentBase implements OnInit {
    shareUrl: string;
    bookingId: string;
    isUpdate: boolean;
    constructor(
        private injector: Injector,
        private _route: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit() {
        this.isUpdate = this._route.snapshot.paramMap.get('isUpdate') === 'true';
        if (!this.isUpdate) {
            this.breadcrumbService.changeBreadcrumb(this._route.snapshot, 'AddSuccess');
        } else {
            this.breadcrumbService.changeBreadcrumb(this._route.snapshot, 'UpdateSuccess');
        }
        this.bookingId = this._route.snapshot.paramMap.get('id');

        this.shareUrl = AppConsts.shareBaseUrl + '/booking/' + this.bookingId;
    }
}
