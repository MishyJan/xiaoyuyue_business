import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'xiaoyuyue-mobile-share-booking-model',
    templateUrl: './share-booking-model.component.html',
    styleUrls: ['./share-booking-model.component.scss']
})
export class MobileShareBookingModelComponent implements OnInit {
    shareUrl: string;

    @ViewChild('shareBookingModel') shareBookingModel: ModalDirective;
    constructor() { }

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
