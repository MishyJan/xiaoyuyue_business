import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
    animations: [accountModuleAnimation()]
})
export class FeedbackComponent extends AppComponentBase implements OnInit {

    constructor(
        private injector: Injector
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
    }


    submit(): void {

    }
}
