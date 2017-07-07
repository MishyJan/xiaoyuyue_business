import { Component, OnInit, Input, ViewChild, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';

@Component({
  selector: 'xiaoyuyue-share-booking-model',
  templateUrl: './share-booking-model.component.html',
  styleUrls: ['./share-booking-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareBookingModelComponent extends AppComponentBase implements OnInit {
  shareUrl: string = "";
  shareBaseUrl: string = "http://vapps.iok.la/booking/about/";

  @ViewChild("shareBookingModel") model: ModalDirective;
  @Input() bookingId: number;
  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  show(bookingId?: number): void {
    if (bookingId) {
      this.shareUrl = this.shareBaseUrl + bookingId;
    } else {
      this.shareUrl = this.shareBaseUrl + this.bookingId;
    }
    this.model.show();
  }

  close(): void {
    this.model.hide();
  }

}
