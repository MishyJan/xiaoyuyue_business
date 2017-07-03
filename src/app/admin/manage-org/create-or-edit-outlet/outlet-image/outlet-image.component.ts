import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'xiaoyuyue-outlet-image',
  templateUrl: './outlet-image.component.html',
  styleUrls: ['./outlet-image.component.scss']
})
export class OutletImageComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
  }

}
