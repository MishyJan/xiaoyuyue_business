import { Component, OnInit, Injector, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { BookingItemEditDto } from "shared/service-proxies/service-proxies";
import { Location } from '@angular/common';

@Component({
  selector: 'app-time-info',
  templateUrl: './time-info.component.html',
  styleUrls: ['./time-info.component.scss']
})
export class TimeInfoComponent extends AppComponentBase implements OnInit {
  // 存储正在编辑的时间信息索引值
  private editIndex: number = 0;
  index: number = 0;
  @Output() changeInput: EventEmitter<BookingItemEditDto[]> = new EventEmitter();
  @Output() timeInfoFormDisabled: EventEmitter<boolean> = new EventEmitter();

  disabled: boolean;
  href: string = document.location.href;
  bookingId: any = +this.href.substr(this.href.lastIndexOf("/") + 1, this.href.length);

  bookingStart = new Date();
  bookingEnd = new Date();

  // 保存本地时间段
  localSingleBookingItem: BookingItemEditDto = new BookingItemEditDto();
  localAllBookingItem: BookingItemEditDto[] = [];

  allBookingTime: Array<any> = [];
  singleTimeInfo: Array<BookingItemEditDto>;

  @Input() timeInfo: BookingItemEditDto[];
  @Input() timeInfoFormVaild: boolean = false;
  isCreateTimeField: boolean = false;
  isShowTimeField: boolean = false;
  isCreateOrEdit: boolean = this.bookingId;

  public bookingDate: Date = new Date();

  constructor(
    injector: Injector,
    private location: Location

  ) {
    super(injector);
  }

  ngOnInit() {
    let bookingTime = new Array();
    bookingTime[0] = this.bookingStart;
    bookingTime[1] = this.bookingEnd;
    this.allBookingTime.push(bookingTime);
  }

  initFlatpickr(defaultD: any) {
    let defaultDate: string[] = [];
    defaultDate = defaultD ? defaultD : defaultDate;
    $("#timeInfoFlatpickr").flatpickr({
      wrap: true,
      defaultDate: defaultDate
    })
  }
  cancel() {
    this.isCreateTimeField = false;
    this.timeInfoFormVaild = true;
    this.timeInfoFormDisabled.emit(this.timeInfoFormVaild);
    if (!this.bookingId) {
      if (this.localSingleBookingItem) {
        this.localAllBookingItem.push(this.localSingleBookingItem)
      }
      return;
    }
    this.timeInfo.push(this.localSingleBookingItem);
  }

  save() {
    this.isCreateTimeField = false;
    this.isShowTimeField = true;

    let allBookingTimeItem = this.bookingTimeToString(this.allBookingTime);
    let timeField = new BookingItemEditDto();

    // 表示时间信息表单已验证，传递给父组件为true
    this.timeInfoFormVaild = true;
    this.timeInfoFormDisabled.emit(this.timeInfoFormVaild);

    // 判断是创建或者编辑的状态
    if (!this.bookingId) {
      // 如果有多个预约时间段，将拆开单个保存数组
      if (allBookingTimeItem.length > 1) {
        let maxBookingNum = this.localSingleBookingItem.maxBookingNum;
        let maxQueueNum = this.localSingleBookingItem.maxQueueNum;
        for (let i = 0; i < allBookingTimeItem.length; i++) {
          this.localSingleBookingItem = new BookingItemEditDto();
          this.localSingleBookingItem.maxBookingNum = maxBookingNum;
          this.localSingleBookingItem.maxQueueNum = maxQueueNum;
          // this.getLocalBookingItem();
          this.localSingleBookingItem.hourOfDay = allBookingTimeItem[i];
          this.localAllBookingItem.push(this.localSingleBookingItem);
        }
        return;
      }
      // this.getLocalBookingItem();
      this.localSingleBookingItem.hourOfDay = allBookingTimeItem[0];
      this.localAllBookingItem.push(this.localSingleBookingItem);
      this.localSingleBookingItem = new BookingItemEditDto();

      this.changeInput.emit(this.localAllBookingItem);
      return;
    }

    // 编辑状态
    if (allBookingTimeItem.length > 1) {
      let maxBookingNum = this.localSingleBookingItem.maxBookingNum;
      let maxQueueNum = this.localSingleBookingItem.maxQueueNum;
      for (let i = 0; i < allBookingTimeItem.length; i++) {
        this.localSingleBookingItem = new BookingItemEditDto();
        this.localSingleBookingItem.maxBookingNum = maxBookingNum;
        this.localSingleBookingItem.maxQueueNum = maxQueueNum;
        // this.getLocalBookingItem();
        this.localSingleBookingItem.hourOfDay = allBookingTimeItem[i];
        this.timeInfo.push(this.localSingleBookingItem);
      }
      return;
    }
    // this.getLocalBookingItem();
    this.localSingleBookingItem.hourOfDay = allBookingTimeItem[0];
    this.timeInfo.push(this.localSingleBookingItem);
    this.localSingleBookingItem = new BookingItemEditDto();

    this.changeInput.emit(this.timeInfo);

  }

  // 点击创建按钮，显示创建时段面板
  createTimeField() {
    let self = this;
    // 点击创建按钮时，创建面板的内容应置空
    this.localSingleBookingItem.maxBookingNum = null;
    this.localSingleBookingItem.maxQueueNum = null;

    setTimeout(function () {
      self.initFlatpickr(undefined);
    }, 10);

    // 表示时间信息表单有新增，需要再次验证，传递给父组件为false
    this.timeInfoFormVaild = false;
    this.timeInfoFormDisabled.emit(this.timeInfoFormVaild);
    this.isCreateTimeField = true;
  }

  // getLocalBookingItem(): BookingItemDto {
  //   this.localSingleBookingItem.availableDates = this.dateToString(this.bookingDate);
  //   return this.localSingleBookingItem;
  // }

  // 增加预约时间段
  addTimeField() {
    this.index++;

    let date = new Array();
    let bookingStart = new Date();
    let bookingEnd = new Date();
    date[0] = bookingStart;
    date[1] = bookingEnd;
    date[0].setMinutes(date[0].getMinutes() + this.index);
    date[1].setMinutes(date[1].getMinutes() + this.index);
    this.allBookingTime.push(date);
  }

  // 移除预约时间
  removeTimeField(index) {
    this.allBookingTime.splice(index, 1);
  }

  // 复制整个时段(单个)
  copyBookingItem(index) {
    if (!this.bookingId) {
      let temp = this.localAllBookingItem[index];
      this.localAllBookingItem.push(temp);
    }
    let temp = this.timeInfo[index];
    this.timeInfo.push(temp);
  }

  // 编辑整个时段(单个)
  editBookingItem(index) {
    let self = this;
    this.editIndex = index;
    let defaultDate = this.localAllBookingItem.length ? this.localAllBookingItem[index].availableDates : this.timeInfo[index].availableDates;
    setTimeout(function () {
      self.initFlatpickr(defaultDate);
    }, 10);
    this.localSingleBookingItem = new BookingItemEditDto();
    this.allBookingTime = [];
    this.isCreateTimeField = true;
    let temp;
    if (!this.bookingId) {
      temp = this.localAllBookingItem[index];
    } else {
      temp = this.timeInfo[index];
    }

    this.bookingDate = this.stringToDate(temp.availableDates);
    this.allBookingTime.push(this.stringToBookingTime(this.bookingDate, temp.hourOfDay));
    this.localSingleBookingItem.maxBookingNum = temp.maxBookingNum;
    this.localSingleBookingItem.maxQueueNum = temp.maxQueueNum;
    this.localSingleBookingItem.availableDates = temp.availableDates;
    this.localSingleBookingItem.hourOfDay = temp.hourOfDay;
    this.removeBookingItem(index);

  }

  // 移除整个时段(单个)
  removeBookingItem(index) {
    if (!this.bookingId) {
      this.localAllBookingItem.splice(index, 1);
      return;
    }
    this.timeInfo.splice(index, 1);
  }

  getBookingTimeItemHeight(): string {
    let height = $(".booking-time-item .input-box").innerHeight() + 15 + 'px';
    return height;
  }

  showAddTimeIcon(index): boolean {
    return index === 0 ? true : false;
  }

  back(): void {
    this.location.back();
  }
  // 日期转为指定格式
  dateToString(date: Date): string {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate();

    let dateFormat = `${year}/${month}/${day}`;

    return dateFormat;
  }

  // 时间数组转为字符串数组
  bookingTimeToString(time): any {
    let bookingTime = [];
    let singleBookingTime = '';
    let char = "-";
    for (let i = 0; i < time.length; i++) {
      for (let j = 0; j < time[i].length; j++) {
        let hour = (time[i][j].getHours() < 10) ? "0" + time[i][j].getHours() : time[i][j].getHours();
        let min = (time[i][j].getMinutes() < 10) ? "0" + time[i][j].getMinutes() : time[i][j].getMinutes();
        let timeItem = hour + ':' + min;
        if (time[i].length - 1 === j) {
          singleBookingTime += hour + ':' + min;
          bookingTime.push(singleBookingTime);
        }
        singleBookingTime = timeItem + "-";
        continue;
      }
    }
    // console.log(singleBookingTime);
    return bookingTime;
  }

  // 字符串转时间对象
  stringToDate(dateString: string): Date {
    let date = new Date(dateString);
    return date;
  }

  // 字符串转date数组
  stringToBookingTime(bookingDate: Date, bookingTime: string): Date[] {
    let temp = bookingTime.split("-");
    let allBookingTime = [];
    let startBookingTime = temp[0].split(":");
    let endBookingTime = temp[1].split(":");

    for (let i = 0; i < temp.length; i++) {
      let date = new Date(bookingDate);

      date.setHours(parseInt(temp[i].split(":")[0]), parseInt(temp[i].split(":")[1]));
      allBookingTime.push(date);
    }

    return allBookingTime;
  }

}
