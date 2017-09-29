import { Component, EventEmitter, Injector, Input, OnInit, Output, Type } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'shared/common/app-component-base';
import { BookingItemEditDto } from 'shared/service-proxies/service-proxies';
import { Location } from '@angular/common';

@Component({
    selector: 'app-time-info',
    templateUrl: './time-info.component.html',
    styleUrls: ['./time-info.component.scss']
})
export class TimeInfoComponent extends AppComponentBase implements OnInit {
    timeInfoFlatpickr: any;
    timeBaseIngoForm: any;
    newTimeField: boolean;
    editingBooking: boolean;
    // 存储正在编辑的时间信息索引值
    private editIndex = 0;
    index = 0;
    @Output() changeInput: EventEmitter<BookingItemEditDto[]> = new EventEmitter();
    @Output() timeInfoFormDisabled: EventEmitter<boolean> = new EventEmitter();

    disabled: boolean;
    href: string = document.location.href;
    bookingId: number;

    bookingStart = new Date(this.setZeroDate());
    bookingEnd = new Date(this.setZeroDate());

    // 保存本地时间段
    localSingleBookingItem: BookingItemEditDto = new BookingItemEditDto();
    localAllBookingItem: BookingItemEditDto[] = [];

    allBookingTime: Array<any> = [];
    singleTimeInfo: Array<BookingItemEditDto>;

    @Input() timeInfo: BookingItemEditDto[];
    @Input() timeInfoFormVaild = false;
    isCreateTimeField = false;
    isShowTimeField = false;
    isCreateOrEdit: boolean;

    public bookingDate: Date = new Date();

    constructor(
        injector: Injector,
        private location: Location,
        private _route: ActivatedRoute

    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingId = +this._route.snapshot.paramMap.get('id');
        this.isCreateOrEdit = this.bookingId ? false : true;
        const bookingTime = new Array();
        bookingTime[0] = this.bookingStart;
        bookingTime[1] = this.bookingEnd;
        this.allBookingTime.push(bookingTime);
        this.initFormValidation();
        this.initFlatpickr(undefined);
    }

    initFlatpickr(defaultD: any) {
        let defaultDate: string[] = [];
        defaultDate = defaultD ? defaultD : defaultDate;
        setTimeout(() => {
            this.timeInfoFlatpickr = $('#timeInfoFlatpickr').flatpickr({
                wrap: true,
                'locale': 'zh',
                defaultDate: defaultDate
            })
        }, 100);
    }

    setZeroDate(): string {
        let date = new Date();
        let fullYear = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${fullYear}-${month}-${day}`;
    }

    // 响应式表单验证
    initFormValidation(): void {
        this.timeBaseIngoForm = new FormGroup({
            maxBookingNum: new FormControl(this.localSingleBookingItem.maxBookingNum, [
                Validators.required,
            ]),
            maxQueueNum: new FormControl(this.localSingleBookingItem.maxQueueNum, [
                Validators.required,
            ])
        })
    }
    get maxBookingNum() {
        return this.timeBaseIngoForm.get('maxBookingNum');
    }
    get maxQueueNum() {
        return this.timeBaseIngoForm.get('maxQueueNum');
    }

    cancel() {
        this.isCreateTimeField = false;
        this.timeInfoFormVaild = true;
        this.timeInfoFormDisabled.emit(this.timeInfoFormVaild);
        if (!this.bookingId) {
            // if (this.localSingleBookingItem) {
            //     this.localAllBookingItem.push(this.localSingleBookingItem)
            // }
            return;
        }
        this.editingBooking && this.timeInfo.push(this.localSingleBookingItem);
    }

    save() {
        this.isCreateTimeField = false;
        this.isShowTimeField = true;

        this.localSingleBookingItem.maxBookingNum = this.timeBaseIngoForm.value.maxBookingNum;
        this.localSingleBookingItem.maxQueueNum = this.timeBaseIngoForm.value.maxQueueNum;

        const allBookingTimeItem = this.bookingTimeToString(this.allBookingTime);
        const timeField = new BookingItemEditDto();

        // 表示时间信息表单已验证，传递给父组件为true
        this.timeInfoFormVaild = true;
        this.timeInfoFormDisabled.emit(this.timeInfoFormVaild);

        // 判断是创建或者编辑的状态
        if (!this.bookingId) {
            // 如果有多个预约时间段，将拆开单个保存数组
            if (allBookingTimeItem.length > 1) {
                const maxBookingNum = this.localSingleBookingItem.maxBookingNum;
                const maxQueueNum = this.localSingleBookingItem.maxQueueNum;
                const availableDates = this.localSingleBookingItem.availableDates;
                for (let i = 0; i < allBookingTimeItem.length; i++) {
                    this.localSingleBookingItem = new BookingItemEditDto();
                    this.localSingleBookingItem.maxBookingNum = maxBookingNum;
                    this.localSingleBookingItem.maxQueueNum = maxQueueNum;
                    this.localSingleBookingItem.availableDates = availableDates;
                    this.localSingleBookingItem.isActive = true;
                    this.localSingleBookingItem.hourOfDay = allBookingTimeItem[i];
                    this.localAllBookingItem.push(this.localSingleBookingItem);
                }
                return;
            }
            this.localSingleBookingItem.isActive = true;
            this.localSingleBookingItem.hourOfDay = allBookingTimeItem[0];
            this.localAllBookingItem.push(this.localSingleBookingItem);
            this.localSingleBookingItem = new BookingItemEditDto();

            this.changeInput.emit(this.localAllBookingItem);
            return;
        }

        // 编辑状态
        if (allBookingTimeItem.length > 1) {
            const maxBookingNum = this.localSingleBookingItem.maxBookingNum;
            const maxQueueNum = this.localSingleBookingItem.maxQueueNum;
            for (let i = 0; i < allBookingTimeItem.length; i++) {
                this.localSingleBookingItem = new BookingItemEditDto();
                this.localSingleBookingItem.maxBookingNum = maxBookingNum;
                this.localSingleBookingItem.maxQueueNum = maxQueueNum;
                this.localSingleBookingItem.hourOfDay = allBookingTimeItem[i];
                this.localSingleBookingItem.isActive = true;
                this.localSingleBookingItem.bookingId = this.bookingId;
                this.timeInfo.push(this.localSingleBookingItem);
            }
            return;
        }
        this.localSingleBookingItem.isActive = true;
        this.localSingleBookingItem.hourOfDay = allBookingTimeItem[0];
        this.timeInfo.push(this.localSingleBookingItem);

        this.localSingleBookingItem = new BookingItemEditDto();

        this.changeInput.emit(this.timeInfo);

    }

    // 点击创建按钮，显示创建时段面板
    createTimeField() {
        // 点击创建按钮时，创建面板的内容应置空
        this.localSingleBookingItem = new BookingItemEditDto();
        this.initFormValidation();
        this.initFlatpickr(undefined);

        // 表示时间信息表单有新增，需要再次验证，传递给父组件为false
        this.isCreateTimeField = true;
        this.editingBooking = false;
        this.timeInfoFormVaild = false;
        this.newTimeField = true;
        this.timeInfoFormDisabled.emit(this.timeInfoFormVaild);
    }

    multipleDateHandler(isMultipleDateFlag: boolean): void {
        console.log(isMultipleDateFlag);
        if (isMultipleDateFlag && this.timeInfoFlatpickr) {
            console.log(this.timeInfoFlatpickr);
            this.timeInfoFlatpickr.set('mode', 'multiple');
        } else if (this.timeInfoFlatpickr) {
            this.timeInfoFlatpickr.destroy();
            this.initFlatpickr(undefined);
        }
    }

    // 增加预约时间段
    addTimeField() {
        this.index++;

        const date = new Array();
        const bookingStart = new Date();
        const bookingEnd = new Date();
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
            const temp = this.localAllBookingItem[index];
            this.localAllBookingItem.push(temp);
        }
        const temp = this.timeInfo[index];
        this.timeInfo.push(temp);
    }

    // 编辑整个时段(单个)
    editBookingItem(index) {
        const self = this;
        this.editIndex = index;
        const defaultDate = this.localAllBookingItem.length ? this.localAllBookingItem[index].availableDates : this.timeInfo[index].availableDates;
        setTimeout(function () {
            self.initFlatpickr(defaultDate);
        }, 10);
        this.localSingleBookingItem = new BookingItemEditDto();
        this.allBookingTime = [];
        this.editingBooking = true;
        this.isCreateTimeField = true;
        let temp;
        if (!this.bookingId) {
            temp = this.localAllBookingItem[index];
        } else {
            temp = this.timeInfo[index];
        }

        this.bookingDate = this.stringToDate(temp.availableDates);
        this.allBookingTime.push(this.stringToBookingTime(this.bookingDate, temp.hourOfDay));
        this.localSingleBookingItem.isActive = true;
        this.localSingleBookingItem.id = temp.id;
        this.localSingleBookingItem.maxBookingNum = temp.maxBookingNum;
        this.localSingleBookingItem.maxQueueNum = temp.maxQueueNum;
        this.localSingleBookingItem.availableDates = temp.availableDates;
        this.localSingleBookingItem.hourOfDay = temp.hourOfDay;
        this.initFormValidation()
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
        const height = $('.booking-time-item .input-box').innerHeight() + 15 + 'px';
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
        const year = date.getFullYear();
        const month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        const day = date.getDate();

        const dateFormat = `${year}/${month}/${day}`;

        return dateFormat;
    }

    // 时间数组转为字符串数组
    bookingTimeToString(time): any {
        const bookingTime = [];
        let singleBookingTime = '';
        const char = '-';
        for (let i = 0; i < time.length; i++) {
            for (let j = 0; j < time[i].length; j++) {
                const hour = (time[i][j].getHours() < 10) ? '0' + time[i][j].getHours() : time[i][j].getHours();
                const min = (time[i][j].getMinutes() < 10) ? '0' + time[i][j].getMinutes() : time[i][j].getMinutes();
                const timeItem = hour + ':' + min;
                if (time[i].length - 1 === j) {
                    singleBookingTime += hour + ':' + min;
                    bookingTime.push(singleBookingTime);
                }
                singleBookingTime = timeItem + '-';
                continue;
            }
        }
        return bookingTime;
    }

    // 字符串转时间对象
    stringToDate(dateString: string): Date {
        const date = new Date(dateString);
        return date;
    }

    // 字符串转date数组
    stringToBookingTime(bookingDate: Date, bookingTime: string): Date[] {
        const temp = bookingTime.split('-');
        const allBookingTime = [];
        const startBookingTime = temp[0].split(':');
        const endBookingTime = temp[1].split(':');

        for (let i = 0; i < temp.length; i++) {
            const date = new Date(bookingDate);

            date.setHours(parseInt(temp[i].split(':')[0]), parseInt(temp[i].split(':')[1]));
            allBookingTime.push(date);
        }

        return allBookingTime;
    }

}
