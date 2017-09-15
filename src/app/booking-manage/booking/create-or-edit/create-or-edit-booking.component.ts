import { AfterViewInit, Component, Injector, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { BookingEditDto, BookingItemEditDto, BookingPictureEditDto, CreateOrUpdateBookingInput, GetBookingForEditOutput, OrgBookingServiceProxy, OutletServiceServiceProxy, PagedResultDtoOfBookingListDto, PictureServiceProxy, SelectListItemDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { appModuleAnimation, appModuleSlowAnimation } from 'shared/animations/routerTransition';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { Location } from '@angular/common';
import { Moment } from 'moment';
import { PictureManageComponent } from './picture-manage/picture-manage.component';
import { Router } from '@angular/router';
import { ShareBookingModelComponent } from './share-booking-model/share-booking-model.component';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/sort-descriptor';
import { TabsetComponent } from 'ngx-bootstrap';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';

@Component({
    selector: 'app-create-or-edit-booking',
    templateUrl: './create-or-edit-booking.component.html',
    styleUrls: ['./create-or-edit-booking.component.less'],
    animations: [appModuleSlowAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class CreateOrEditBookingComponent extends AppComponentBase implements OnInit, AfterViewInit {
    timeBaseInfoForm: FormGroup;
    bookingBaseInfoForm: FormGroup;
    editingIndex: boolean[] = [];
    startHourOfDay = '00:00';
    endHourOfDay = '00:00';
    isEditing = false;
    isNew = true;
    nextIndex = 1;
    tenantInfo: TenantInfoEditDto = new TenantInfoEditDto();
    // 传给图片管理组件
    pictureInfo: BookingPictureEditDto[] = [];

    allPictureForEdit: BookingPictureEditDto[];
    outletSelectListData: SelectListItemDto[];
    contactorSelectListData: SelectListItemDto[];

    formVaild: boolean;
    allBookingTime: BookingItemEditDto[] = [];
    infoFormValid: boolean;
    bookingDataForEdit: GetBookingForEditOutput;
    baseInfo: BookingEditDto = new BookingEditDto();
    timeInfo: BookingItemEditDto[];

    href: string = document.location.href;
    bookingId: any = +this.href.substr(this.href.lastIndexOf('/') + 1, this.href.length);

    input: CreateOrUpdateBookingInput = new CreateOrUpdateBookingInput();

    selectOutletId: number;
    selectContactorId: number;
    saving = false;
    savingAndEditing = false;
    //   是否显示完善机构信息弹窗
    isShowImperfectTip = false;

    /* 移动端代码开始 */
    // 保存本地时间段
    dafaultDate: string = moment().format('YYYY-MM-DD');
    localSingleBookingItem: BookingItemEditDto = new BookingItemEditDto();
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild('shareBookingModel') shareBookingModel: ShareBookingModelComponent;
    @ViewChild('pictureManageModel') pictureManageModel: PictureManageComponent;
    /* 移动端代码结束 */

    public outletSelectDefaultItem: string;
    public contactorSelectDefaultItem: string;
    constructor(
        injector: Injector,
        private _locaition: Location,
        private _router: Router,
        private _pictureServiceProxy: PictureServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _organizationBookingServiceProxy: OrgBookingServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.loadData();
        this.getTenantInfo();
        this.initFormValidation();
    }

    ngAfterViewInit() {
        this.initFlatpickr();
    }

    ngOnChanges(changes: SimpleChanges) {
        // this.localSingleBookingItem.availableDates = this.dafaultDate;
    }

    // 响应式表单验证
    initFormValidation(): void {
        this.bookingBaseInfoForm = new FormGroup({
            bookingName: new FormControl(this.baseInfo.name, [
                Validators.required,
                Validators.maxLength(20),
            ]),
            bookingDescription: new FormControl(this.baseInfo.description, [
                Validators.required,
                Validators.minLength(10)
            ])
        });

        this.timeBaseInfoForm = new FormGroup({
            maxBookingNum: new FormControl(this.localSingleBookingItem.maxBookingNum, [
                Validators.required,
            ]),
            maxQueueNum: new FormControl(this.localSingleBookingItem.maxQueueNum, [
                Validators.required,
            ])
        });
    }
    get bookingName() { return this.bookingBaseInfoForm.get('bookingName'); }
    get bookingDescription() { return this.bookingBaseInfoForm.get('bookingDescription'); }

    get maxBookingNum() { return this.timeBaseInfoForm.get('maxBookingNum'); }
    get maxQueueNum() { return this.timeBaseInfoForm.get('maxQueueNum'); }

    /**
    * desktop
    */
    back() {
        // this._locaition.back();
        this._router.navigate(['/booking']);
    }

    /**
     * data
     */
    // 获取机构信息是否完善
    getTenantInfo(): void {
        this._tenantInfoServiceProxy
            .getTenantInfoForEdit()
            .subscribe(result => {
                if (!(result.backgroundPictureUrl && result.logoUrl && result.tagline && result.description)) {
                    this.isShowImperfectTip = true;
                    return;
                }
                this.isShowImperfectTip = false;
            });
    }

    loadData() {
        if (!this.bookingId) {
            // 获取门店下拉框数据源
            this.loadOutletData();
            return;
        }

        this._organizationBookingServiceProxy
            .getBookingForEdit(this.bookingId)
            .subscribe(result => {
                this.bookingDataForEdit = result;
                this.baseInfo = result.booking;
                this.timeInfo = result.items;
                this.pictureInfo = result.bookingPictures;
                this.initFormValidation();
                if (this.isMobile()) {
                    this.allBookingTime = result.items;
                    this.isNew = false;
                }
                // this.pictureManageModel.refreshAllPictrueEdit();
                this.loadOutletData();
            });
    }

    // 获取门店下拉框数据源
    loadOutletData() {
        this._outletServiceServiceProxy
            .getOutletSelectList()
            .subscribe(outletResult => {
                this.outletSelectDefaultItem = this.bookingDataForEdit ? this.bookingDataForEdit.booking.outletId.toString() : outletResult[0].value;
                this.outletSelectListData = outletResult;
                this.selectOutletId = +outletResult[0].value;

                // 获取联系人下拉框数据源
                this._outletServiceServiceProxy
                    .getContactorSelectList(parseInt(this.outletSelectDefaultItem))
                    .subscribe(contactorResult => {
                        this.contactorSelectListData = contactorResult;
                        this.contactorSelectDefaultItem = contactorResult[0].value;
                        this.selectContactorId = +contactorResult[0].value;
                    });
            });
    }

    save() {
        this.baseInfo.name = this.bookingBaseInfoForm.value.bookingName;
        this.baseInfo.description = this.bookingBaseInfoForm.value.bookingDescription;

        this.input.booking.id = this.bookingId ? this.bookingId : 0;
        this.input.booking = this.baseInfo;
        this.input.booking.outletId = this.selectOutletId;
        this.input.booking.contactorId = this.selectContactorId;
        this.input.booking.isActive = true;
        // 判断是否有添加新的时间信息
        this.input.items = this.allBookingTime ? this.timeInfo : this.allBookingTime;
        // 判断是否上传过图片
        if (this.allPictureForEdit) {
            this.input.bookingPictures = this.allPictureForEdit;
        } else {
            this.input.bookingPictures = this.pictureInfo;
        }
        this.saving = true;
        this._organizationBookingServiceProxy
            .createOrUpdateBooking(this.input)
            .finally(() => { this.saving = false })
            .subscribe((result) => {
                abp.event.trigger('bookingListSelectChanged');
                if (!this.isMobile()) {
                    this.shareBookingModel.show(result.id);
                } else {
                    this._router.navigate(['/booking/succeed', result.id]);
                }
            });
    }

    saveAndEdit() {
        this.baseInfo.name = this.bookingBaseInfoForm.value.bookingName;
        this.baseInfo.description = this.bookingBaseInfoForm.value.bookingDescription;

        this.input.booking.id = this.bookingId ? this.bookingId : 0;
        this.input.booking = this.baseInfo;
        this.input.booking.outletId = this.selectOutletId;
        this.input.booking.contactorId = this.selectContactorId;
        this.input.booking.isActive = true;
        // 判断是否有添加新的时间信息
        this.input.items = this.allBookingTime ? this.timeInfo : this.allBookingTime;
        // 判断是否上传过图片
        if (this.allPictureForEdit) {
            this.input.bookingPictures = this.allPictureForEdit;
        } else {
            this.input.bookingPictures = this.pictureInfo;
        }
        this.saving = true;
        this._organizationBookingServiceProxy
            .createOrUpdateBooking(this.input)
            .finally(() => { this.saving = false })
            .subscribe((result) => {
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

    public outletChange(outlet: any): void {
        this.selectOutletId = parseInt(outlet);
        this._outletServiceServiceProxy
            .getContactorSelectList(this.selectOutletId)
            .subscribe(result => {
                this.contactorSelectListData = result;
                this.contactorSelectDefaultItem = result[0].value;
                this.selectContactorId = +result[0].value;
            })
    }

    public contactorChange(contactor: any): void {
        this.selectContactorId = parseInt(contactor);
    }

    getAllPictureForEdit(pictureForEdit: BookingPictureEditDto[]) {
        this.allPictureForEdit = pictureForEdit;
    }

    // 移动端代码
    initFlatpickr() {
        const self = this;
        if ($('#createTimeFlatpickr')) {
            $('#createTimeFlatpickr').flatpickr({
                disableMobile: false,
                wrap: true,
                'locale': 'zh',
                defaultDate: self.dafaultDate
            })
        }
    }
    nextStep(): void {
        this.staticTabs.tabs[this.nextIndex].active = true;
    }

    // tab点击的时候更新tab索引值 
    updateNextIndex(index: number): void {
        this.nextIndex = index;
        this.refreshData();
    }

    isShowConfirm(): boolean {
        if (this.nextIndex === 3) {
            return true;
        }
        return false;
    }
    createTimeField(): void {
        this.isNew = true;
        setTimeout(() => {
            this.initFlatpickr();
        }, 100);
    }
    savePanelTimeField(): void {
        this.isNew = false;
        this.localSingleBookingItem.isActive = true;
        this.localSingleBookingItem.hourOfDay = this.startHourOfDay + '-' + this.endHourOfDay;
        this.localSingleBookingItem.maxBookingNum = this.timeBaseInfoForm.value.maxBookingNum;
        this.localSingleBookingItem.maxQueueNum = this.timeBaseInfoForm.value.maxQueueNum;
        this.allBookingTime.push(this.localSingleBookingItem);
        this.startHourOfDay = '00:00';
        this.endHourOfDay = '00:00';
        console.log(this.localSingleBookingItem);

        this.localSingleBookingItem = new BookingItemEditDto();
    }

    getPicUploadInfoHandler(picUploadInfo: UploadPictureDto): void {
        let temp = new BookingPictureEditDto();
        temp.pictureId = picUploadInfo.pictureId;
        temp.pictureUrl = picUploadInfo.pictureUrl;
        this.pictureInfo.push(temp)
    }

    editingTimeField(index: number): void {
        this.editingIndex[index] = true;
    }

    deleteTimeField(index: number): void {
        this.allBookingTime.splice(index, 1);
    }

    saveTimeField(index: number): void {
        this.editingIndex[index] = false;
    }

    // 刷新数据（由于使用模型驱动表单验证，所以需要更新数据到DTO）
    refreshData(): void {
        this.baseInfo.name = this.bookingBaseInfoForm.value.bookingName;
        this.baseInfo.description = this.bookingBaseInfoForm.value.bookingDescription;
    }


    // PC端代码

    /* 业务代码 */
    // 判断是否有移动端的DOM元素
    isMobile(): boolean {
        if ($('.mobile-create-booking').length > 0) {
            return true;
        };
        return false;
    }
}
