import { BookingAccessRecordInputSource, BookingAccessRecordInputWeChatSource, BookingOrderListDtoStatus, CodeSendInputCodeType, DefaultTimezoneScope, IsTenantAvailableOutputState, UserNotificationState } from '@shared/service-proxies/service-proxies';

export class AppTimezoneScope {
    static Application: number = DefaultTimezoneScope._1;
    static Tenant: number = DefaultTimezoneScope._2;
    static User: number = DefaultTimezoneScope._4;
}

export class AppUserNotificationState {
    static Unread: number = UserNotificationState._0;
    static Read: number = UserNotificationState._1;
}

export class AppTenantAvailabilityState {
    static Available: number = IsTenantAvailableOutputState._1;
    static InActive: number = IsTenantAvailableOutputState._2;
    static NotFound: number = IsTenantAvailableOutputState._3;
}

// 根据枚举名获取数据源
export class AppEnumSelectItemSource {
    static UserActivationOption = 'UserActivationOption';
}

// 应约人订单状态
export class BookingOrderStatus {
    static WaitConfirm: number = BookingOrderListDtoStatus._1;
    static ConfirmSuccess: number = BookingOrderListDtoStatus._2;
    static ConfirmFail: number = BookingOrderListDtoStatus._3;
    static Cancel: number = BookingOrderListDtoStatus._4;
    static WaitComment: number = BookingOrderListDtoStatus._5;
    static Complete: number = BookingOrderListDtoStatus._6;

    static WaitConfirmLocalization = 'BookingOrderStatus.WaitConfirm';
    static ConfirmSuccessLocalization = 'BookingOrderStatus.ConfirmSuccess';
    static ConfirmFailLocalization = 'BookingOrderStatus.ConfirmFail';
    static CancelLocalization = 'BookingOrderStatus.Cancel';
    static CompleteLocalization = 'BookingOrderStatus.Complete';
    static WaitCommentLocalization = 'BookingOrderStatus.WaitComment';
}

// 手机验证的类型
export class VerificationCodeType {
    static Register: number = CodeSendInputCodeType._10;
    static Login: number = CodeSendInputCodeType._20;
    static ChangePassword: number = CodeSendInputCodeType._30;
    static EmailBinding: number = CodeSendInputCodeType._40;
    static EmailUnbinding: number = CodeSendInputCodeType._50;
    static PhoneBinding: number = CodeSendInputCodeType._60;
    static PhoneUnBinding: number = CodeSendInputCodeType._70;
    static PhoneVerify: number = CodeSendInputCodeType._80;
}

// 默认图片上传分组ID
export class DefaultUploadPictureGroundId {
    static AllGroup = -1;
    static NoGroup = 0;
    static BookingGroup = 1;
    static OutletGroup = 2;
    static LinkmanGroup = 3;
    static AvatarGroup = 4;
}

export class BookingAccessSourceType {

    static WeChat: number = BookingAccessRecordInputSource._10;
    static WeiBo: number = BookingAccessRecordInputSource._20;
    static QQ: number = BookingAccessRecordInputSource._30;
    static QrCode: number = BookingAccessRecordInputSource._40;
    static Other: number = BookingAccessRecordInputSource._50;

    static getType(source: string): number {
        switch (source) {
            case 'WeChat':
                return this.WeChat;
            case 'WeiBo':
                return this.WeiBo;
            case 'QQ':
                return this.QQ;
            case 'QrCode':
                return this.QrCode;
            default:
                return this.Other;
        }
    }
}

export class WeChatAccessSourceType {

    static SingleMessage: number = BookingAccessRecordInputWeChatSource._10;
    static GroupMessage: number = BookingAccessRecordInputWeChatSource._20;
    static TimeLine: number = BookingAccessRecordInputWeChatSource._30;
    static Other: number = BookingAccessRecordInputWeChatSource._40;

    static getType(source: string): number {
        switch (source) {
            case 'SingleMessage':
                return this.SingleMessage;
            case 'GroupMessage':
                return this.GroupMessage;
            case 'TimeLine':
                return this.TimeLine;
            default:
                return this.Other;
        }
    }
}

// 验证的类型
export class SendCodeType {
    static ShortMessage = 1;
    static Email = 2;
}