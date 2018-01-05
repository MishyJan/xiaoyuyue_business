import { Component, OnInit, Injector } from '@angular/core';
import * as _ from 'lodash';
import { AppComponentBase } from 'shared/common/app-component-base';
import { CookiesService } from 'shared/services/cookies.service';
import { accountModuleAnimation } from 'shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-lang-switch',
    templateUrl: './lang-switch.component.html',
    styleUrls: ['./lang-switch.component.scss'],
    animations: [accountModuleAnimation()]
})
export class LangSwitchComponent extends AppComponentBase implements OnInit {
    currentLanguage: abp.localization.ILanguageInfo;
    languages: abp.localization.ILanguageInfo[] = [];
    constructor(injector: Injector,
        private _cookiesService: CookiesService) {
        super(injector);
    }

    ngOnInit() {
        this.languages = _.filter(abp.localization.languages, l => (<any>l).isDisabled === false);
        this.currentLanguage = abp.localization.currentLanguage;
    }

    changeLanguage(language: abp.localization.ILanguageInfo) {
        this._cookiesService.setCookieValue(
            'Abp.Localization.CultureName',
            language.name,
            new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
            abp.appPath
        );

        location.reload();
    }

}
