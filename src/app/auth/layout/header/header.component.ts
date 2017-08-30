import { Component, OnInit } from '@angular/core';

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

export class HeaderComponent implements OnInit {

    constructor(
        public anchorsLinksData: AnchorsDto = new AnchorsDto()
    ) { }

    ngOnInit() {
        this.init();
    }

    init(): void {
        this.anchorsLinksData.aboutLink = AppConsts.shareBaseUrl + '/#about';
        this.anchorsLinksData.howUsed = AppConsts.shareBaseUrl + '/#table';
        this.anchorsLinksData.contactUs = AppConsts.shareBaseUrl + '/#contact';
    }

}
