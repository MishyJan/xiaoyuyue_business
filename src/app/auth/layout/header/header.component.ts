import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';

export class AnchorsDto {
    aboutLink: string;
    howUsed: string;
    contactUs: string;
}

@Component({
    selector: 'xiaoyuyue-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [AnchorsDto]
})

export class HeaderComponent extends AppComponentBase implements OnInit {

    constructor(
        injector: Injector,
        public anchorsLinksData: AnchorsDto = new AnchorsDto()
    ) {
        super(injector);
    }

    ngOnInit() {
        this.init();
    }

    init(): void {
        this.anchorsLinksData.aboutLink = AppConsts.shareBaseUrl + '/#about';
        this.anchorsLinksData.howUsed = AppConsts.shareBaseUrl + '/#table';
        this.anchorsLinksData.contactUs = AppConsts.shareBaseUrl + '/#contact';
    }

    goToHome(): void {
        (window as any).location.href = '/';
    }
}
