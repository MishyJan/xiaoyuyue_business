import { Component, Inject, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GetBookingDetailOutput, OrgBookingServiceProxy } from 'shared/service-proxies/service-proxies';

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
  bookingDto: GetBookingDetailOutput;
  @ViewChild('shareBookingModel') model: ModalDirective;
  @Input() bookingId: number;
  @Input() slogen: string;
  constructor(
    injector: Injector,
    private _router: Router,
    private _orgBookingServiceProxy: OrgBookingServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
  }

  show(bookingId?: number): void {
    if (bookingId) {
      this.shareUrl = AppConsts.userCenterUrl + '/booking/' + bookingId;
    } else {
      this.shareUrl = AppConsts.userCenterUrl + '/booking/' + this.bookingId;
    }
    this.model.show();

    this._orgBookingServiceProxy
      .getBookingDetail(bookingId)
      .subscribe(result => {
        this.bookingDto = result;
      });

  }

  close(): void {
    this.model.hide();
    this._router.navigate(['/booking/list']);
  }

  getQQShareUrl() {
    const para = {
      url: this.shareUrl,
      desc: this.l('ShareMyBooking', this.bookingDto.name),
      title: this.l('ShareApp'),
      summary: this.l('MetaDescription'),
      pics: 'https://www.xiaoyuyue.com/assets/common/images/index/contact/logo.png',
      site: this.l('Xiaoyuyue'),
      style: '201',
    };

    let s = [];
    for (const i in para) { s.push(i + '=' + encodeURIComponent(para[i] || '')); }

    const qqShareUrl = 'https://connect.qq.com/widget/shareqq/index.html?' + s.join('&');
    window.open(qqShareUrl);
  }

  getQzoneShareUrl() {
    const para = {
      url: this.shareUrl.replace('http://', '').replace('https://', ''),
      showcount: '0',
      descriptiont: this.l('ShareMyBooking', this.bookingDto.name),
      summary: this.l('MetaDescription'),
      title: this.l('ShareApp'),
      site: this.l('Xiaoyuyue'),
      pics: 'https://www.xiaoyuyue.com/assets/common/images/index/contact/logo.png',
      style: '203',
    };

    let s = [];
    for (const i in para) { s.push(i + '=' + encodeURIComponent(para[i] || '')); }

    const qqShareUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&');
    window.open(qqShareUrl);
  }

  getWeiBoShareUrl() {
    const para = {
      url: this.shareUrl,
      appkey: 160189366,
      title: this.l('ShareMyBooking', this.bookingDto.name),
      pic: 'https://www.xiaoyuyue.com/assets/common/images/index/contact/logo.png',
      searchPic: true,
    };

    let s = [];
    for (const i in para) { s.push(i + '=' + encodeURIComponent(para[i] || '')); }

    const qqShareUrl = 'https://service.weibo.com/share/share.php?' + s.join('&');
    window.open(qqShareUrl);
  }

  getFacebookShareUrl() {
    const para = {
      u: this.shareUrl,
      t: this.l('ShareApp'),
      description: this.l('ShareMyBooking', this.bookingDto.name),
      picture: 'https://www.xiaoyuyue.com/assets/common/images/index/contact/logo.png',
      quote: this.l('ShareApp'),
    };

    let s = [];
    for (const i in para) { s.push(i + '=' + encodeURIComponent(para[i] || '')); }

    const qqShareUrl = 'https://www.facebook.com/sharer/sharer.php?' + s.join('&');
    window.open(qqShareUrl);
  }


  // 单击复制文本
  // copyText(text: string): void {
  //   var Url2 = document.getElementById("biao1");
  //   Url2.select(); // 选择对象
  //   document.execCommand("Copy"); // 执行浏览器复制命令
  //   alert("已复制好，可贴粘。");
  // }

}
