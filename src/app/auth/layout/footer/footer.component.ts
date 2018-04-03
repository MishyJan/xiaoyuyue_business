import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
  selector: 'xiaoyuyue-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

}
