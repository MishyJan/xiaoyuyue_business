import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
    selector: 'xiaoyuyue-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent extends AppComponentBase implements OnInit {

    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
    }

}
