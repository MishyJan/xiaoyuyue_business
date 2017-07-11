import { Component, OnInit, Injector, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { appModuleAnimation } from "shared/animations/routerTransition";
import { AppComponentBase } from "shared/common/app-component-base";
import { NgxAni } from "ngxani";
import { OrgBookingServiceProxy, PagedResultDtoOfBookingListDto, BookingListDto, CreateOrUpdateBookingInput, OutletServiceServiceProxy, SelectListItemDto, ActiveOrDisableInput } from "shared/service-proxies/service-proxies";
import { AppConsts } from "shared/AppConsts";
import { SortDescriptor } from "@progress/kendo-data-query/dist/es/sort-descriptor";

import * as moment from 'moment';
import { Router } from "@angular/router";
import { SelectHelper } from "shared/helpers/SelectHelper";
// import { PaginationBaseDto } from 'app/admin/shared/utils/pagination.dto';
// import { PaginationComponent } from "app/admin/shared/pagination/pagination.component";

@Component({
  selector: 'app-manage-booking',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  animations: [appModuleAnimation()],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookingListComponent extends AppComponentBase implements OnInit {
  itemsPerPage: number = AppConsts.grid.defaultPageSize;
  currentPage: number = 0;

  activeOrDisable: ActiveOrDisableInput = new ActiveOrDisableInput();
  outletSelectDefaultItem: string;
  outletSelectListData: SelectListItemDto[];
  bookingActiveSelectListData: Object[] = SelectHelper.defaultList();
  bookingActiveSelectDefaultItem: object;

  organizationBookingResultData: BookingListDto[];

  endCreationTime: any;
  startCreationTime: any;

  isActive: boolean;
  outletId: number;
  bookingName: string;

  maxResultCount: number;
  skipCount: number;
  sorting: string;

  shareBaseUrl: string = AppConsts.shareBaseUrl + "/booking/about/";
  // @ViewChild("PaginationModel")PaginationModel: PaginationComponent;

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
    // this.bookingActiveSelectDefaultItem = this.bookingActiveSelectListData[0];
    // console.log(this.bookingActiveSelectDefaultItem.displayText)
    this.loadData();
    this.bookingActiveSelectDefaultItem = {
      value: "",
      displayText: "请选择"
    };
  }

  ngAfterViewInit() {
    $(".startCreationTime").flatpickr();
    $(".endCreationTime").flatpickr();
  }


  loadData() {
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
        let pagesCount = [];
        // this.PaginationModel.countPagesTotal(result.totalCount,);
        if (typeof this.startCreationTime === "object") {
          this.startCreationTime = this.startCreationTime.format('YYYY-MM-DD');
          this.endCreationTime = this.endCreationTime.format('YYYY-MM-DD');
        }
        this.organizationBookingResultData = result.items;
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
  public outletChangeHandler(outlet: any): void {
    this.outletId = outlet;
  }
  // 预约状态搜索下拉框值改变时
  public bookingActiveChangeHandler(bookingActive: any): void {
    this.isActive = bookingActive;
  }

  // // 获取分页组件的结果
  // getPaginationResult(pagingResult: PaginationBaseDto) {
  //   this.skipCount = pagingResult.skipCount;
  //   this.maxResultCount = pagingResult.maxResultCount;
  //   this.sorting = pagingResult.sorting;
  //   this.loadData();
  // }
}
