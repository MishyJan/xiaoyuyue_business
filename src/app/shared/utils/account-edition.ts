import { EditionWithFeaturesDto, CreatePaymentDtoEditionPaymentType } from "shared/service-proxies/service-proxies";

export class AccountEditionOutput {
    /*
    editionsInfo：获取所有版本信息
    editionId：获取要开通的版本ID
    editionPaymentType：购买来源，开通、升级、续费
    editionPaymentDisplayName：支付显示类型，开通会员、续费会员、升级会员
*/
    editionsInfo: EditionWithFeaturesDto[];
    editionId: number;
    editionPaymentType: CreatePaymentDtoEditionPaymentType;
    editionPaymentDisplayName: string;
}
