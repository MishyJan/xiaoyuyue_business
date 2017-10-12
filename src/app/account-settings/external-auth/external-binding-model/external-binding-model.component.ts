import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from './../../../../shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'xiaoyuyue-external-binding-model',
  templateUrl: './external-binding-model.component.html',
  styleUrls: ['./external-binding-model.component.scss']
})
export class ExternalBindingModelComponent extends AppComponentBase implements OnInit {

  title: string;
  slogen: string;
  externalUrl: string;
  checkTimer: NodeJS.Timer;

  @ViewChild('externalBindingModel') model: ModalDirective;
  @Output() weChatBindRsult: EventEmitter<boolean> = new EventEmitter();

  constructor(private injector: Injector,
    private _appSessionService: AppSessionService,
    private _cookiesService: CookiesService) {
    super(injector);
  }

  ngOnInit() {

  }

  show(provideName): void {
    this.title = this.l('Binding') + this.l(provideName)
    this.slogen = this.l('BindingSlogen', this.l(provideName));
    this.externalUrl = AppConsts.shareBaseUrl + '/auth/external?authToken=' + this._cookiesService.getToken() + '&isAuthBind=true&redirectUrl=' + encodeURIComponent(document.location.href);
    console.log(this.externalUrl);
    this.model.show();
    this.checkIsBind();
  }

  close(): void {
    this.model.hide();
    clearInterval(this.checkTimer);
  }

  checkIsBind() {
    this.checkTimer = setInterval(() => {
      this._appSessionService.init();
      if (this._appSessionService.user.weChat) {
        clearInterval(this.checkTimer);
        this.weChatBindRsult.emit(true);
        this.close();
      }
    }, 1000);
  }
}
