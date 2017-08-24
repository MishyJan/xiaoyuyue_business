import { MediaCompressFormat } from 'shared/AppConsts';

export class PictureUrlHelper {
    static getCompressUrl(url: string, compressProt: string): string {
        return url + '?' + compressProt;
    }

    static getBookingListPicCompressUrl(url: string): string {
        return url + '?' + MediaCompressFormat.bookingListFormat;
    }

    static getBookingInfoPicCompressUrl(url: string): string {
        return url + '?' + MediaCompressFormat.bookingInfoFormat;
    }

    static getOutletListPicCompressUrl(url: string): string {
        return url + '?' + MediaCompressFormat.outletListFormat;
    }

    static getOutletInfoPicCompressUrl(url: string): string {
        return url + '?' + MediaCompressFormat.outletInfoFormat;
    }

    static getContactorPicCompressUrl(url: string): string {
        return url + '?' + MediaCompressFormat.contactorFormat;
    }

    static getMinProfilePicCompressUrl(url: string): string {
        return url + '?' + MediaCompressFormat.minProfilePictureFormat;
    }
}