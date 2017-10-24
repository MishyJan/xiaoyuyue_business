import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, transition } from '@angular/core';
import { BookingEditDto, BookingItemEditDto, BookingPictureEditDto, CreateOrUpdateBookingInput, GetBookingForEditOutput, OrgBookingServiceProxy, OutletServiceServiceProxy, PagedResultDtoOfBookingListDto, PictureServiceProxy, SelectListItemDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { Location } from '@angular/common';
import { Moment } from 'moment';
import { PictureManageComponent } from './picture-manage/picture-manage.component';
import { ShareBookingModelComponent } from './share-booking-model/share-booking-model.component';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/sort-descriptor';
import { TabsetComponent } from 'ngx-bootstrap';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';
import { appModuleSlowAnimation } from 'shared/animations/routerTransition';
import { element } from 'protractor';

export class BookingInfoOptions {
    needGender: boolean;
    needAge: boolean;
    needEmail: boolean;
}
@Component({
    selector: 'app-create-or-edit-booking',
    templateUrl: './create-or-edit-booking.component.html',
    styleUrls: ['./create-or-edit-booking.component.scss'],
    animations: [appModuleSlowAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class CreateOrEditBookingComponent extends AppComponentBase implements OnInit, AfterViewInit, OnChanges {

    needInfoOptions: BookingInfoOptions = new BookingInfoOptions();
    
    bookingId: number;
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
    allPictureForEdit: BookingPictureEditDto[] = [];
    outletSelectListData: SelectListItemDto[];
    contactorSelectListData: SelectListItemDto[];

    formVaild: boolean;
    timeInfoFormValid: boolean;
    allBookingTime: BookingItemEditDto[] = [];
    bookingDataForEdit: GetBookingForEditOutput;
    baseInfo: BookingEditDto = new BookingEditDto();
    input: CreateOrUpdateBookingInput = new CreateOrUpdateBookingInput();

    selectOutletId: number;
    selectContactorId: number;
    saving = false;
    savingAndEditing = false;
    // 是否显示完善机构信息弹窗
    isShowImperfectTip = false;
    // 是否显示补充门店信息弹窗
    needImperfectOutlet = false;

    /* 移动端代码开始 */
    // 保存本地时间段
    dafaultDate: string;
    localSingleBookingItem: BookingItemEditDto = new BookingItemEditDto();
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild('shareBookingModel') shareBookingModel: ShareBookingModelComponent;
    @ViewChild('pictureManageModel') pictureManageModel: PictureManageComponent;
    /* 移动端代码结束 */

    public outletSelectDefaultItem: string;
    public contactorSelectDefaultItem: string;
    constructor(
        injector: Injector,
        private _router: Router,
        private _pictureServiceProxy: PictureServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _organizationBookingServiceProxy: OrgBookingServiceProxy,
        private _weChatShareTimelineService: WeChatShareTimelineService,
        private _route: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingId = +this._route.snapshot.paramMap.get('id');
        this.loadData();
        this.getTenantInfo();
        this.initFormValidation();
        this.localSingleBookingItem.availableDates = this.dafaultDate = moment().format('YYYY-MM-DD');
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
                Validators.maxLength(10),
            ]),
            bookingDescription: new FormControl(this.baseInfo.description, [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(100)
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
                this.allBookingTime = result.items;
                this.pictureInfo = result.bookingPictures;
                this.initFormValidation();
                this.allBookingTime = result.items;
                this.needInfoOptions.needAge = result.booking.needAge;
                this.needInfoOptions.needGender = result.booking.needGender;
                this.needInfoOptions.needEmail = result.booking.needEmail;
                if (this.isMobile($('.mobile-create-booking'))) {
                    this.isNew = false;
                }
                // this.pictureManageModel.refreshAllPictrueEdit();
                this.loadOutletData();
                this.initWechatShareConfig();

                this.timeInfoFormValid = true;
            });
    }

    // 获取门店下拉框数据源
    loadOutletData() {
        this._outletServiceServiceProxy
            .getOutletSelectList()
            .subscribe(outletResult => {
                if (outletResult.length <= 0) {
                    this.needImperfectOutlet = true;
                } else {
                    this.outletSelectDefaultItem = this.bookingDataForEdit ? this.bookingDataForEdit.booking.outletId.toString() : outletResult[0].value;
                    this.outletSelectListData = outletResult;
                    this.selectOutletId = +this.outletSelectDefaultItem;

                    // 获取联系人下拉框数据源
                    this._outletServiceServiceProxy
                        .getContactorSelectList(parseInt(this.outletSelectDefaultItem))
                        .subscribe(contactorResult => {
                            if (contactorResult.length <= 0) { return; }
                            this.contactorSelectDefaultItem = this.bookingDataForEdit ? this.bookingDataForEdit.booking.contactorId.toString() : contactorResult[0].value;
                            this.contactorSelectListData = contactorResult;
                            this.selectContactorId = +this.contactorSelectDefaultItem;
                        });
                }
            });
    }

    save() {
        this.saving = true;
        this.createOrUpdateBooking();
    }

    saveAndEdit() {
        this.savingAndEditing = true;
        this.createOrUpdateBooking(true);
    }

    createOrUpdateBooking(saveAndEdit: boolean = false) {
        if (this.bookingBaseInfoForm.invalid) {
            if (this.isMobile($('.mobile-create-booking'))) {
                this.message.warn('预约信息未完善');
                this.staticTabs.tabs[0].active = true;
            } else {
                this.message.error('', '预约信息未完善!');
                this.saving = false;
                this.savingAndEditing = false;
            }
            return;
        }

        if (this.allBookingTime.length < 1) {
            if (this.isMobile($('.mobile-create-booking'))) {
                this.message.warn('时间信息未完善');
                this.staticTabs.tabs[1].active = true;
            } else {
                this.message.error('', '时间信息未完善!');
                this.saving = false;
                this.savingAndEditing = false;
            }
            return;
        }

        if (!this.timeInfoFormValid) {
            this.message.error('', '时间信息尚未保存!');
            this.saving = false;
            this.savingAndEditing = false;
            return;
        }

        this.baseInfo.needAge = this.needInfoOptions.needAge;
        this.baseInfo.needGender = this.needInfoOptions.needGender;
        this.baseInfo.needEmail = this.needInfoOptions.needEmail;
        this.baseInfo.name = this.bookingBaseInfoForm.value.bookingName;
        this.baseInfo.description = this.bookingBaseInfoForm.value.bookingDescription;

        this.input.booking.id = this.bookingId ? this.bookingId : 0;
        this.input.booking = this.baseInfo;
        this.input.booking.outletId = this.selectOutletId;
        this.input.booking.contactorId = this.selectContactorId;
        this.input.booking.isActive = true;
        // 判断是否有添加新的时间信息
        this.input.items = this.allBookingTime;
        // 判断是否上传过图片
        this.input.bookingPictures = this.allPictureForEdit.length > 0 ? this.allPictureForEdit : this.pictureInfo;

        this._organizationBookingServiceProxy
            .createOrUpdateBooking(this.input)
            .finally(() => { this.savingAndEditing = false })
            .subscribe((result) => {
                this.bookingId = result.id;
                abp.event.trigger('bookingListSelectChanged');
                if (saveAndEdit) {
                    this.notify.success('保存成功');
                    return;
                }

                if (this.isMobile($('.mobile-create-booking'))) {
                    this._router.navigate(['/booking/succeed', result.id]);
                } else {
                    this.shareBookingModel.show(result.id);
                }
            });
    }

    getTimeInfoInput(allBookingTime: BookingItemEditDto[]) {
        this.allBookingTime = allBookingTime;
    }

    getInfoFormValid(timeInfoFormValid: boolean) {
        this.timeInfoFormValid = timeInfoFormValid;
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

    removeBookingPic(picIndex: number): void {
        this.pictureInfo.splice(picIndex, 1);
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
        this.localSingleBookingItem.availableDates = this.dafaultDate = moment().format('YYYY-MM-DD');
        this.initFormValidation();
        setTimeout(() => {
            this.initFlatpickr();
        }, 100);
    }

    savePanelTimeField(): void {
        this.isNew = false;
        this.timeInfoFormValid = true;
        this.localSingleBookingItem.isActive = true;
        this.localSingleBookingItem.hourOfDay = this.startHourOfDay + '-' + this.endHourOfDay;
        this.localSingleBookingItem.maxBookingNum = this.timeBaseInfoForm.value.maxBookingNum;
        this.localSingleBookingItem.maxQueueNum = this.timeBaseInfoForm.value.maxQueueNum;
        this.allBookingTime.push(this.localSingleBookingItem);
        this.startHourOfDay = '00:00';
        this.endHourOfDay = '00:00';

        this.localSingleBookingItem = new BookingItemEditDto();
    }

    getPicUploadInfoHandler(picUploadInfo: UploadPictureDto): void {
        if (this.pictureInfo.length >= 4) {
            this.notify.warn('不能超过四张');
            return;
        }
        const temp = new BookingPictureEditDto();
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
    initWechatShareConfig() {
        if (this.baseInfo && this.isWeiXin()) {
            this._weChatShareTimelineService.input.sourceUrl = document.location.href;
            this._weChatShareTimelineService.input.title = this.l('ShareMyBooking', this.baseInfo.name);
            this._weChatShareTimelineService.input.desc = this.l(this.baseInfo.name);
            this._weChatShareTimelineService.input.imgUrl = AppConsts.appBaseUrl + '/assets/common/images/logo.jpg';
            this._weChatShareTimelineService.input.link = AppConsts.shareBaseUrl + '/booking/' + this.bookingId;
            this._weChatShareTimelineService.initWeChatShareConfig();
        }
    }
}
