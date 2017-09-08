export class Permissions {
    static readonly Name: string = 'BusiCenter';

    static readonly Dashboard = 'BusiCenter.Dashboard';

    static readonly bookingManage = 'BusiCenter.BookingManage';

    static readonly bookingManage_Bookings = 'BusiCenter.BookingManage.Bookings';
    static readonly bookingManage_BookingCreate = 'BusiCenter.BookingManage.Booking.Create';
    static readonly bookingManage_BookingEdit = 'BusiCenter.BookingManage.Booking.Edit';
    static readonly bookingManage_BookingDelete = 'BusiCenter.BookingManage.Booking.Delete';
    static readonly bookingManage_BookingDisable = 'BusiCenter.BookingManage.Booking.Disable';
    static readonly bookingManage_BookingCopy = 'BusiCenter.BookingManage.Booking.Copy';

    static readonly bookingManage_BookingOrders = 'BusiCenter.BookingManage.BookingOrders';
    static readonly bookingManage_BookingOrderEdit = 'BusiCenter.BookingManage.BookingOrder.Edit';
    static readonly bookingManage_BookingOrderDelete = 'BusiCenter.BookingManage.BookingOrder.Delete';
    static readonly bookingManage_BookingOrderConfirm = 'BusiCenter.BookingManage.BookingOrder.Confirm';
    static readonly bookingManage_BookingOrderRemark = 'BusiCenter.BookingManage.BookingOrder.Remark';

    static readonly organization = 'BusiCenter.Organization';
    static readonly organization_BaseInfo = 'BusiCenter.Organization.BaseInfo';
    static readonly organization_Outlets = 'BusiCenter.Organization.Outlets';
    static readonly organization_OutletCreate = 'BusiCenter.Organization.Outlet.Create';
    static readonly organization_OutletEdit = 'BusiCenter.Organization.Outlet.Edit';
    static readonly organization_OutletDelete = 'BusiCenter.Organization.Outlet.Delete';
    static readonly organization_Contactors = 'BusiCenter.Organization.Contactors';
    static readonly organization_ContactorCreate = 'BusiCenter.Organization.Contactor.Create';
    static readonly organization_ContactorEdit = 'BusiCenter.Organization.Contactor.Edit';
    static readonly organization_ContactorDelete = 'BusiCenter.Organization.Contactor.Delete';

    static readonly contentManage = 'BusiCenter.ContentManage';
    static readonly contentManage_PictureGallery = 'BusiCenter.ContentManage.PictureGallery';
    static readonly contentManage_PictureGallery_GroupCreate = 'BusiCenter.ContentManage.PictureGallery.Group.Create';
    static readonly contentManage_PictureGallery_GroupEdit = 'BusiCenter.ContentManage.PictureGallery.Group.Edit';
    static readonly contentManage_PictureGallery_GroupDelete = 'BusiCenter.ContentManage.PictureGallery.Group.Delete';

    static readonly contentManage_Pictures = 'BusiCenter.ContentManage.Pictures';
    static readonly contentManage_PictureCreate = 'BusiCenter.ContentManage.Picture.Create';
    static readonly contentManage_PictureEdit = 'BusiCenter.ContentManage.Picture.Edit';
    static readonly contentManage_PictureDelete = 'BusiCenter.ContentManage.Picture.Delete';
}
