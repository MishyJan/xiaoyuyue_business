import { ActivatedRouteSnapshot, Event, NavigationEnd, Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';

import { AppConsts } from '@shared/AppConsts';
import { Breadcrumb } from 'shared/services/bread-crumb.service';
import { LocalizationService } from 'abp-ng2-module/src/localization/localization.service';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
    commonlocalizationSourceName = AppConsts.localization.commonLocalizationSourceName;

    constructor(private localization: LocalizationService,
        private titleService: Title) {

    }

    setTitle(routesCollection: Breadcrumb[]) {
        const title = `${this.l('Xiaoyuyue')}`;

        const titles = routesCollection.filter((route) => route.displayName);

        if (!titles.length) { return title; }

        const routeTitle = this.titlesToString(titles);
        this.titleService.setTitle(`${routeTitle} - ${title}`);
    }

    private titlesToString(titles) {
        return titles.reduce((prev, curr) => {
            return `${this.l(curr.displayName)}`;
        }, '');
    }

    private l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (localizedText === key) {
            localizedText = this.localization.localize(key, this.commonlocalizationSourceName);
        }

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }
}