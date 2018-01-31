import { AfterViewInit, Component, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';

@Component({
  selector: 'qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent extends AppComponentBase implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private _$qrcodeDiv: JQuery;
  private _qrcode;

  defaultIconUrl = AppConsts.appBaseUrl + '/assets/common/images/logo.jpg';

  @Input('iconUrl') iconUrl: string;
  @Input('value') value: string;
  @Input('size') size: number;

  constructor(
    injector: Injector,
    private _element: ElementRef
  ) {
    super(injector);
    this._$qrcodeDiv = $(this._element.nativeElement);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this._$qrcodeDiv.addClass('qrcode-block');
    if (!this.size) {
      this.size = 150;
    }
  }

  ngOnChanges(changes) {
    if ('value' in changes ||
      'size' in changes) {
      this.generate();
    }
  }

  ngOnDestroy() {
    if (this._qrcode) {
      this._qrcode.clear();
    }
  }

  generate() {

    if (!this.value) {
      return;
    }

    if (this._qrcode) {
      this._qrcode.clear();
      this._qrcode.makeCode(this.value);
    } else {

      this._qrcode = new QRCode(this._element.nativeElement, {
        text: this.value,
        width: this.size,
        height: this.size,
        colorDark: '#000',
        colorLight: '#fff',
        correctLevel: QRCode.CorrectLevel.H,

        // ==== Title
        title: '', // value
        // titleFont: 'bold 18px Arial', // font. default is "bold 16px Arial"
        // titleColor: '#004284', // color. default is "#000"
        // titleBgColor: '#fff', // background color. default is "#fff"
        titleHeight: 0, // height, including subTitle. default is 50
        // titleTop: 25, // draws y coordinates. default is 30

        // ==== SubTitle
        subTitle: '', // value
        // subTitleFont: '14px Arial', // font. default is "14px Arial"
        // subTitleColor: '#004284', // color. default is "gray"
        // subTitleTop: 40, // draws y coordinates. default is 50

        // ==== Logo
        logo: this.iconUrl ? this.iconUrl : this.defaultIconUrl, // Relative address, relative to `easy.qrcode.min.js`
        // 	logoWidth:80, // widht. default is automatic width
        // 	logoHeight:80 // height. default is automatic height
      });
    }
  }
}
