import { Component, OnInit, ViewChild, Injector } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
    selector: 'xiaoyuyue-mobile-share-booking-model',
    templateUrl: './share-booking-model.component.html',
    styleUrls: ['./share-booking-model.component.scss']
})
export class MobileShareBookingModelComponent extends AppComponentBase implements OnInit {
    shareUrl: string;

    @ViewChild('shareBookingModel') shareBookingModel: ModalDirective;
    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    show(shareUrl: string): void {
        this.shareUrl = shareUrl;
        this.shareBookingModel.show();
    }

    hide(): void {
        this.shareBookingModel.hide();
    }

}
