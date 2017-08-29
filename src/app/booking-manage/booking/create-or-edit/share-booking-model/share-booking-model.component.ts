import { Component, Inject, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'xiaoyuyue-share-booking-model',
  templateUrl: './share-booking-model.component.html',
  styleUrls: ['./share-booking-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareBookingModelComponent extends AppComponentBase implements OnInit {
  shareUrl = '';

  @ViewChild('shareBookingModel') model: ModalDirective;
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
      this.shareUrl = AppConsts.shareBaseUrl + '/booking/' + bookingId;
    } else {
      this.shareUrl = AppConsts.shareBaseUrl + '/booking/' + this.bookingId;
    }
    this.model.show();
  }

  close(): void {
    this.model.hide();
    this._router.navigate(['/booking/list']);
  }

  // 单击复制文本
  // copyText(text: string): void {
  //   var Url2 = document.getElementById("biao1");
  //   Url2.select(); // 选择对象
  //   document.execCommand("Copy"); // 执行浏览器复制命令
  //   alert("已复制好，可贴粘。");
  // }

}
