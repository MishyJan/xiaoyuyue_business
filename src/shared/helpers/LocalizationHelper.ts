import { AppConsts } from 'shared/AppConsts';

export class LocalizationHelper {
    static l(key: string, ...args: any[]): string {
        let localizedText = this.localize(key, AppConsts.localization.defaultLocalizationSourceName);

        if (localizedText === key) {
            localizedText = this.localize(key, AppConsts.localization.commonLocalizationSourceName);
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

    static localize(key: string, sourceName: string): string {
        return abp.localization.localize(key, sourceName);
    }

    static getFlatpickrLocale() {
        switch (abp.localization.currentLanguage.name) {
            case 'zh-CN':
                return 'zh';
            case 'zh-HK':
                return 'hk';
            default:
                return 'zh';
        }
    }
}
