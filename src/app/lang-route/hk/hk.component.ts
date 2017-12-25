import { Component, OnInit } from '@angular/core';

import { AppConsts } from '../../../shared/AppConsts';
import { CookiesService } from 'shared/services/cookies.service';
import { Router } from '@angular/router';

@Component({
    selector: 'xiaoyuyue-hk',
    templateUrl: './hk.component.html',
    styleUrls: ['./hk.component.scss']
})
export class HkComponent implements OnInit {

    constructor(
        private _cookiesService: CookiesService,
        private _router: Router,
    ) { }

    ngOnInit() {
        this.changeLanguage();
        // window.location.href = AppConsts.appBaseUrl;
        this._router.navigate(['/dashboard']);
    }

    changeLanguage() {
        this._cookiesService.setCookieValue(
            'Abp.Localization.CultureName',
            'zh-HK',
            new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
            abp.appPath
        );
    }
}
