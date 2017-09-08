import { BookingOrderListDtoStatus, ChatMessageDtoReadState, ChatMessageDtoSide, CodeSendInputCodeType, DefaultTimezoneScope, FriendDtoState, IsTenantAvailableOutputState, UserNotificationState } from '@shared/service-proxies/service-proxies';

export class AppChatMessageReadState {
    static Unread: number = ChatMessageDtoReadState._1;
    static Read: number = ChatMessageDtoReadState._2;
}

export class AppChatSide {
    static Sender: number = ChatMessageDtoSide._1;
    static Receiver: number = ChatMessageDtoSide._2;
}

export class AppFriendshipState {
    static Accepted: number = FriendDtoState._1;
    static Blocked: number = FriendDtoState._2;
}


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
export class OrgBookingOrderStatus {
    static WaitConfirm: number = BookingOrderListDtoStatus._1;
    static ConfirmSuccess: number = BookingOrderListDtoStatus._2;
    static ConfirmFail: number = BookingOrderListDtoStatus._3;
    static Cancel: number = BookingOrderListDtoStatus._4;
    static WaitComment: number = BookingOrderListDtoStatus._5;
    static Complete: number = BookingOrderListDtoStatus._6;

    static WaitConfirmLocalization = 'Enums.Xiaoyuyue.Enums.BookingOrderStatus.WaitConfirm';
    static ConfirmSuccessLocalization = 'Enums.Xiaoyuyue.Enums.BookingOrderStatus.ConfirmSuccess';
    static ConfirmFailLocalization = 'Enums.Xiaoyuyue.Enums.BookingOrderStatus.ConfirmFail';
    static CancelLocalization = 'Enums.Xiaoyuyue.Enums.BookingOrderStatus.Cancel';
    static CompleteLocalization = 'Enums.Xiaoyuyue.Enums.BookingOrderStatus.Complete';
    static WaitCommentLocalization = 'Enums.Xiaoyuyue.Enums.BookingOrderStatus.WaitComment';
}

// 手机验证的类型
export class VerificationCodeType {
    static Register: number = CodeSendInputCodeType._10;
    static Login: number = CodeSendInputCodeType._20;
    static ChangePassword: number = CodeSendInputCodeType._30;
    static ChangeEmail: number = CodeSendInputCodeType._40;
    static PhoneBinding: number = CodeSendInputCodeType._50;
    static PhoneVerify: number = CodeSendInputCodeType._60;
}
