import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { BookingEditDto } from "shared/service-proxies/service-proxies";

@Component({
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.less']
})
export class BaseInfoComponent extends AppComponentBase implements OnInit {

  input: BookingEditDto = new BookingEditDto();

  constructor(
    injector: Injector
  ) {
    super(injector);
    // setInterval(() => {
    // }, 1000)
  }

  ngOnInit() {
    this.input.contactorId = 0;
  }

}
