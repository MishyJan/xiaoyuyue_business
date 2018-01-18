import { Component, Inject, Injector, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GetBookingDetailOutput, OrgBookingServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';

declare const FB: any; // Facebook API

@Component({
  selector: 'xiaoyuyue-share-booking-model',
  templateUrl: './share-booking-model.component.html',
  styleUrls: ['./share-booking-model.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ShareBookingModelComponent extends AppComponentBase implements OnInit {
  shareUrl = '';
  sharePic = 'https://www.xiaoyuyue.com/assets/common/images/index/contact/logo.png';
  openWindowsOptions = 'toolbar=0,status=0,width=580,height=636';
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
      pics: this.sharePic,
      site: this.l('Xiaoyuyue'),
      style: '201',
    };

    const qqShareUrl = 'https://connect.qq.com/widget/shareqq/index.html?' + this.getParamArray(para).join('&');
    window.open(qqShareUrl);
  }

  getQzoneShareUrl() {
    const para = {
      url: this.shareUrl.replace('http://', '').replace('https://', ''),
      showcount: '0',
      descriptiont: this.l('ShareMyBooking', this.bookingDto.name),
      summary: this.l('MetaDescription'),
      title: this.l('ShareMyBooking', this.bookingDto.name),
      site: this.l('Xiaoyuyue'),
      pics: this.sharePic,
      style: '203',
    };

    const qzoneShareUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + this.getParamArray(para).join('&');
    window.open(qzoneShareUrl, '_blank', this.openWindowsOptions);
  }

  getWeiBoShareUrl() {
    const para = {
      url: this.shareUrl,
      appkey: 160189366,
      title: this.l('ShareMyBooking', this.bookingDto.name),
      pic: this.sharePic,
      searchPic: true,
    };

    const wbShareUrl = 'https://service.weibo.com/share/share.php?' + this.getParamArray(para).join('&');
    window.open(wbShareUrl, '_blank', this.openWindowsOptions);
  }

  getFacebookShareUrl() {
    const para = {
      u: 'https://www.xiaoyuyue.com/booking/10',
      t: this.l('ShareApp'),
      description: this.l('ShareMyBooking', this.bookingDto.name),
      quote: this.l('ShareMyBooking', this.bookingDto.name),
      hashtag: '#' + this.l('Xiaoyuyue'),
    };

    const fbShareUrl = 'https://www.facebook.com/sharer.php?' + this.getParamArray(para).join('&');
    window.open(fbShareUrl, '_blank', this.openWindowsOptions);
  }

  getTwitterShareUrl() {
    const para = {
      url: this.shareUrl,
      text: this.l('ShareMyBooking', this.bookingDto.name),
      hashtags: this.l('Xiaoyuyue'),
    };

    const s = [];
    for (const i in para) { s.push(i + '=' + encodeURIComponent(para[i] || '')); }

    const twShareUrl = 'https://twitter.com/share?' + s.join('&');
    window.open(twShareUrl, '_blank', this.openWindowsOptions);
  }

  getLinkInShareUrl() {
    const para = {
      url: this.shareUrl,
      mini: true,
      title: this.l('ShareMyBooking', this.bookingDto.name),
      summary: this.l('ShareApp'),
      source: this.l('Xiaoyuyue'),
    };

    const liShareUrl = 'https://www.linkedin.com/shareArticle?' + this.getParamArray(para).join('&');
    window.open(liShareUrl, '_blank', this.openWindowsOptions);
  }

  getParamArray(para: object): string[] {
    const s = [];
    for (const i in para) { s.push(i + '=' + encodeURIComponent(para[i] || '')); }
    return s;
  }


  onHidden() {
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
