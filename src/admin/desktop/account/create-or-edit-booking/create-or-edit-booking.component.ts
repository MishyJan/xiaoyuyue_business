import { Component, OnInit, Injector, Input } from '@angular/core';
import { Location } from '@angular/common';
import { AppComponentBase } from "shared/common/app-component-base";
import { appModuleAnimation } from "shared/animations/routerTransition";
import { OrganizationBookingServiceProxy, PagedResultDtoOfBookingListDto, CreateOrUpdateBookingInput, BookingEditDto, BookingItemEditDto, GetBookingForEditOutput, OutletServiceServiceProxy, SelectListItemDto, BookingPictureEditDto } from "shared/service-proxies/service-proxies";

import * as moment from 'moment';
import { AppConsts } from "shared/AppConsts";
import { SortDescriptor } from "@progress/kendo-data-query/dist/es/sort-descriptor";
import { Router } from "@angular/router";


@Component({
  selector: 'app-create-or-edit-booking',
  templateUrl: './create-or-edit-booking.component.html',
  styleUrls: ['./create-or-edit-booking.component.less'],
  animations: [appModuleAnimation()]
})
export class CreateOrEditBookingComponent extends AppComponentBase implements OnInit {
  // 传给图片管理组件
  pictureInfo: BookingPictureEditDto[];

  pictureForEdit: BookingPictureEditDto;
  allPictureForEdit: BookingPictureEditDto[] = [];
  outletSelectListData: SelectListItemDto[];
  contactorSelectListData: SelectListItemDto[];

  formVaild: boolean;
  allBookingTime: BookingItemEditDto[];
  infoFormValid: boolean;
  bookingDataForEdit: GetBookingForEditOutput;
  baseInfo: BookingEditDto = new BookingEditDto();
  timeInfo: BookingItemEditDto[];

  href: string = document.location.href;
  bookingId: any = +this.href.substr(this.href.lastIndexOf("/") + 1, this.href.length);

  input: CreateOrUpdateBookingInput = new CreateOrUpdateBookingInput();

  selectOutletId: number;
  selectContactorId: number;

  public outletSelectDefaultItem: string;
  public contactorSelectDefaultItem: string;
  constructor(
    injector: Injector,
    private _locaition: Location,
    private _router: Router,
    private _outletServiceServiceProxy: OutletServiceServiceProxy,
    private _organizationBookingServiceProxy: OrganizationBookingServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loadData();


  }

  ngAfterViewInit() {
  }


  loadData() {

    if (!this.bookingId) {
      // 获取门店下拉框数据源
      this._outletServiceServiceProxy
        .getOutletSelectList()
        .subscribe(result => {
          this.outletSelectDefaultItem = result[0].value;
          this.selectOutletId = parseInt(result[0].value);
          this.outletSelectListData = result;

          // 获取联系人下拉框数据源
          this._outletServiceServiceProxy
            .getContactorSelectList(parseInt(this.outletSelectListData[0].value))
            .subscribe(result => {
              this.contactorSelectDefaultItem = result[0].value;
              this.selectContactorId = parseInt(result[0].value);
              this.contactorSelectListData = result;
            })
        })
      return;
    }

    this._organizationBookingServiceProxy
      .getBookingForEdit(this.bookingId)
      .subscribe(result => {
        this.bookingDataForEdit = result;
        this.baseInfo = result.booking;
        this.timeInfo = result.items;
        this.pictureInfo = result.bookingPictures;

        // 获取门店下拉框数据源
        this._outletServiceServiceProxy
          .getOutletSelectList()
          .subscribe(result => {
            this.outletSelectDefaultItem = this.bookingDataForEdit.booking.outletId.toString();
            this.outletSelectListData = result;
            this.selectOutletId = parseInt(result[0].value);

            // 获取联系人下拉框数据源
            this._outletServiceServiceProxy
              .getContactorSelectList(this.bookingDataForEdit.booking.outletId)
              .subscribe(result => {
                this.contactorSelectListData = result;
                this.contactorSelectDefaultItem = result[0].value;
                this.selectContactorId = parseInt(result[0].value);
              })
          })
      })
  }

  save() {
    this.input.booking = this.baseInfo;
    this.input.booking.outletId = this.selectOutletId;
    this.input.booking.contactorId = this.selectContactorId;
    // 判断是否有添加新的时间信息
    this.input.items = !this.allBookingTime ? this.timeInfo : this.allBookingTime;
    // 判断是否上传过图片
    if (this.pictureForEdit) {
      this.allPictureForEdit.push(this.pictureForEdit);
      this.input.bookingPictures = this.allPictureForEdit;
    }
    this._organizationBookingServiceProxy
      .createOrUpdateBooking(this.input)
      .subscribe(() => {
        this.notify.success("保存成功!");
        this.back();
      });
  }

  saveAndEdit() {
    this.input.booking = this.baseInfo;
    this.input.items = this.allBookingTime;
    this._organizationBookingServiceProxy
      .createOrUpdateBooking(this.input)
      .subscribe(() => {
        this.notify.success("创建成功!");
      });
  }

  // 表单验证
  // bookingFormVaild(): boolean {
  //   this.formVaild = !this.infoFormValid || !(this.baseInfo.name || this.baseInfo.description);
  //   return this.formVaild;
  // }

  getTimeInfoInput(allBookingTime: BookingItemEditDto[]) {
    this.allBookingTime = allBookingTime;
  }
  getInfoFormValid(infoFormValid: boolean) {
    this.infoFormValid = infoFormValid;
  }

  back() {
    // this._locaition.back();
    this._router.navigate(['/app/admin/booking'])
  }

  public outletChange(outlet: any): void {
    this.selectOutletId = parseInt(outlet);
    this._outletServiceServiceProxy
      .getContactorSelectList(this.selectOutletId)
      .subscribe(result => {
        this.contactorSelectListData = result;
        this.contactorSelectDefaultItem = result[0].value;
        // this.contactorSelectDefaultItem.text = this.contactorSelectListData[0].text;
        // this.contactorSelectDefaultItem.value = parseInt(this.contactorSelectListData[0].value);
      })
  }

  public contactorChange(contactor: any): void {
    this.selectContactorId = parseInt(contactor);
  }

  getPictureForEdit(pictureForEdit: BookingPictureEditDto) {
    this.pictureForEdit = pictureForEdit;
  }
}
