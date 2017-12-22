import { Component, OnInit } from '@angular/core';
import { CookiesService } from 'shared/services/cookies.service';
import { AppConsts } from '../../../shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-hk',
    templateUrl: './hk.component.html',
    styleUrls: ['./hk.component.scss']
})
export class HkComponent implements OnInit {

    constructor(
        private _cookiesService: CookiesService
    ) { }

    ngOnInit() {
        this.changeLanguage();
        window.location.href = AppConsts.appBaseUrl;
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
