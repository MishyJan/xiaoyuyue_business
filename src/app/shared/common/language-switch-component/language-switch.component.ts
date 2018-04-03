import * as _ from 'lodash';

import { ChangeUserLanguageDto, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';

@Component({
    selector: 'languageSwitch',
    templateUrl: './language-switch.component.html',
    styleUrls: ['./language-switch.component.scss']
})
export class LanguageSwitchComponent extends AppComponentBase implements OnInit {

    currentLanguage: abp.localization.ILanguageInfo;
    languages: abp.localization.ILanguageInfo[] = [];

    constructor(injector: Injector,
        private _cookiesService: CookiesService,
        private _profileServiceProxy: ProfileServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {
        this.languages = _.filter(abp.localization.languages, l => (<any>l).isDisabled === false);
        this.currentLanguage = abp.localization.currentLanguage;
    }

    changeLanguage(language: abp.localization.ILanguageInfo) {
        // 登陆状态下修改默认语言
        if (this.appSession.user) {
            const input = new ChangeUserLanguageDto();
            input.languageName = language.name;

            this._profileServiceProxy.changeLanguage(input).subscribe(() => {
                this.setLanguageCookies(language.name)
            });
        } else {
            this.setLanguageCookies(language.name)
        }
    }

    setLanguageCookies(languageName: string) {
        abp.utils.setCookieValue(
            'Abp.Localization.CultureName',
            languageName,
            new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
            abp.appPath
        );
        location.reload();
    }
}