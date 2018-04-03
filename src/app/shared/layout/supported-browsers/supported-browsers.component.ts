import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
    selector: 'xiaoyuyue-supported-browsers',
    templateUrl: './supported-browsers.component.html',
    styleUrls: ['./supported-browsers.component.scss']
})
export class SupportedBrowsersComponent extends AppComponentBase implements OnInit {

    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
    }

}
