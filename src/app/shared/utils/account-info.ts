import { PaysType } from 'shared/AppEnums';

export class AccountInfo {
    tenantName: string;
    editionId: number;
    editionDisplayName: string;
    editionTimeLimit: string;
    maxBookingCount: number;
    maxOutletCount: number;
    subCreatedBookingCount: number;
    subCreatedOutletCount: number;
    paysType: PaysType;
    paysTypeDisplayName: string;
}