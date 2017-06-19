import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";

@Component({
  selector: 'sms-setting',
  templateUrl: './sms-setting.component.html',
  styleUrls: ['./sms-setting.component.css']
})
export class SmsSettingComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
  }
 
}
