import { Component, OnInit, Input, ViewChild, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { Router } from '@angular/router';

@Component({
  selector: 'xiaoyuyue-share-booking-model',
  templateUrl: './share-booking-model.component.html',
  styleUrls: ['./share-booking-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareBookingModelComponent extends AppComponentBase implements OnInit {
  shareUrl: string = "";
  shareBaseUrl: string = "http://business.xiaoyuyue.com/booking/about/";

  @ViewChild("shareBookingModel") model: ModalDirective;
  @Input() bookingId: number;
  constructor(
    injector: Injector,
    private _router: Router
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
    this._router.navigate(['/app/admin/booking/list']);
  }

}
