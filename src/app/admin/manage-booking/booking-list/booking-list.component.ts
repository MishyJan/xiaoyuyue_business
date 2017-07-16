import { Component, OnInit, Injector, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { appModuleAnimation } from "shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import { NgxAni } from "ngxani";
import { OrgBookingServiceProxy, PagedResultDtoOfBookingListDto, BookingListDto, CreateOrUpdateBookingInput, OutletServiceServiceProxy, SelectListItemDto, ActiveOrDisableInput } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import { SortDescriptor } from "@progress/kendo-data-query/dist/es/sort-descriptor";

import * as moment from 'moment';
import { Router } from "@angular/router";
import { SelectHelper } from "shared/helpers/SelectHelper";
import { ShareBookingModelComponent } from "app/admin/manage-booking/create-or-edit-booking/share-booking-model/share-booking-model.component";

@Component({
  selector: 'app-manage-booking',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  animations: [appModuleAnimation()],
//   changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookingListComponent extends AppComponentBase implements OnInit {
  // 保存预约列表背景图的比例
  bookingBgW: number = 384;
  bookingBgH: number = 214;

  activeOrDisable: ActiveOrDisableInput = new ActiveOrDisableInput();
  outletSelectDefaultItem: string;
  outletSelectListData: SelectListItemDto[];
  bookingActiveSelectListData: Object[] = SelectHelper.defaultList();
  bookingActiveSelectDefaultItem: object;

  organizationBookingResultData: BookingListDto[];
  pictureDefaultBgUrl: string = '/assets/common/images/login/bg1.jpg';
  // pictureDefaultBgUrl: string = "/assets/common/images/admin/booking-bg.jpg";

  endCreationTime: any;
  startCreationTime: any;

  isActive: boolean;
  outletId: number;
  bookingName: string;

  maxResultCount: number = AppConsts.grid.defaultPageSize;
  skipCount: number = 0;
  sorting: string;
  totalItems: number = 0;
  currentPage: number = 0;

  shareBaseUrl: string = AppConsts.shareBaseUrl + "/booking/about/";
  @ViewChild("shareBookingModel") shareBookingModel: ShareBookingModelComponent;
  @ViewChild("bookingBg") bookingBgElement: ElementRef;

  constructor(
    injector: Injector,
    private _ngxAni: NgxAni,
    private _router: Router,
    private _outletServiceServiceProxy: OutletServiceServiceProxy,
    private _organizationBookingServiceProxy: OrgBookingServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loadData();
    this.bookingActiveSelectDefaultItem = {
      value: "",
      displayText: "请选择"
    };
  }

  ngAfterViewInit() {
    let self = this;
    setTimeout(function () {
      self.renderDOM();
    }, 600);

    window.addEventListener("resize", function () {
      self.renderDOM();
    })
    $(".startCreationTime").flatpickr({
      "locale": "zh"
    });
    $(".endCreationTime").flatpickr({
      "locale": "zh"
    });
  }


  loadData(): void {
    this.startCreationTime = this.startCreationTime ? moment(this.startCreationTime) : undefined;
    this.endCreationTime = this.endCreationTime ? moment(this.endCreationTime) : undefined;

    // 获取可用下拉框数据源
    this._outletServiceServiceProxy
      .getOutletSelectList()
      .subscribe(result => {
        // 添加请选择数据源
        let input = new SelectListItemDto();
        input.text = "请选择";
        input.value = "";
        this.outletSelectListData = result;
        this.outletSelectListData.unshift(input);
        this.outletSelectDefaultItem = result[0].value;
      })

    this._organizationBookingServiceProxy
      .getBookings(this.bookingName, this.outletId, this.isActive, this.startCreationTime, this.endCreationTime, this.sorting, this.maxResultCount, this.skipCount)
      .subscribe(result => {
        let self = this;
        this.totalItems = result.totalCount;
        this.organizationBookingResultData = result.items;
        if (typeof this.startCreationTime === "object") {
          this.startCreationTime = this.startCreationTime.format('YYYY-MM-DD');
          this.endCreationTime = this.endCreationTime.format('YYYY-MM-DD');
        }
        setTimeout(function () {
          self.renderDOM();
        }, 10);
      })
  }
  getMoment(arg: string) {
    if (arg === undefined) return undefined;
    return moment(arg);
  }

  editHandler(bookingId: number) {
    this._router.navigate(['app/admin/booking/edit', bookingId]);
  }

  // 正面翻转到背面
  flipToBack(flipAni: any, event) {
    this._ngxAni.to(flipAni, .6, {
      transform: "rotateY(180deg)"
    })
  }

  // 背面翻转到正面
  flipToFront(flipAni: any, event) {
    this._ngxAni.to(flipAni, .6, {
      transform: "rotateY(0)"
    })
  }

  // 禁用预约样式
  disabledBookingClass(disabledAni: any, index) {
    this._ngxAni.to(disabledAni, .6, {
      "filter": "grayscale(100%)"
    })
    this.activeOrDisable.id = this.organizationBookingResultData[index].id;
    this.activeOrDisable.isActive = false;
    this._organizationBookingServiceProxy
      .activedOrDisableBooking(this.activeOrDisable)
      .subscribe(result => {
        this.notify.success("已关闭预约!");
        this.loadData();
      });
  }

  // 显示禁用之前预约样式
  beforeBookingClass(disabledAni: any, index) {
    this._ngxAni.to(disabledAni, .6, {
      "filter": "grayscale(0)"
    })
    this.activeOrDisable.id = this.organizationBookingResultData[index].id;
    this.activeOrDisable.isActive = true;
    this._organizationBookingServiceProxy
      .activedOrDisableBooking(this.activeOrDisable)
      .subscribe(result => {
        this.notify.success("已开启预约!");
        this.loadData();
      });
  }

  // 复制预约
  copyBooking(index) {
    let bookingId = this.organizationBookingResultData[index].id;
    let input = new CreateOrUpdateBookingInput();

    this.message.confirm("是否要复制当前预约", (isCopy) => {
      if (isCopy) {
        this._organizationBookingServiceProxy
          .getBookingForEdit(bookingId)
          .subscribe(result => {

            input.booking = result.booking;
            input.booking.id = 0;
            input.bookingPictures = result.bookingPictures;
            input.items = result.items;
            if (input.items) {
              for (let i = 0; i < input.items.length; i++) {
                input.items[i].id = 0;
                input.items[i].bookingId = 0;
              }
            }

            // 创建预约
            this._organizationBookingServiceProxy
              .createOrUpdateBooking(input)
              .subscribe(() => {
                this.loadData();
                this.notify.success("复制成功！");
              })
          });
      }
    });

  }

  // 删除预约
  removeBooking(index) {
    let bookingId = this.organizationBookingResultData[index].id;
    this.message.confirm("是否要删除当前预约", (isDelete) => {
      if (isDelete) {
        this._organizationBookingServiceProxy
          .deleteBooking(bookingId)
          .subscribe(() => {
            this.loadData();
            this.notify.success("删除成功！");
          });
      }
    });
  }

  // 门店搜索下拉框值改变时
  outletChangeHandler(outlet: any): void {
    this.outletId = outlet;
  }
  // 预约状态搜索下拉框值改变时
  bookingActiveChangeHandler(bookingActive: any): void {
    this.isActive = bookingActive;
  }

  // 分享按钮弹出分享model
  shareHandler(bookingId: number): void {
    this.shareBookingModel.show(bookingId);
  }

  onPageChange(index: number): void {
    this.currentPage = index;
    this.skipCount = this.maxResultCount * (this.currentPage - 1);
    this.loadData();
  }

  // 渲染DOM，获取DOM元素的宽高
  renderDOM(): void {
    let bookingBgRatio = this.bookingBgH / this.bookingBgW;
    // 获取预约item的宽度，得出背景图的高度
    let bookingBgH = Math.round($(".top-banner-wrap .org-bg img").innerWidth() * bookingBgRatio);
    $(".top-banner-wrap").height(bookingBgH);

    $(".booking-item").height($(".front-wrap").innerHeight());

  }
}
