import * as _ from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, transition } from '@angular/core';
import { BookingEditDto, BookingItemEditDto, BookingPictureEditDto, CreateOrUpdateBookingInput, GetBookingForEditOutput, OrgBookingServiceProxy, OutletServiceServiceProxy, PagedResultDtoOfBookingListDto, PictureServiceProxy, SelectListItemDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { ClientTypeHelper } from 'shared/helpers/ClientTypeHelper';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { LocalStorageService } from 'shared/utils/local-storage.service';
import { LocalizationHelper } from 'shared/helpers/LocalizationHelper';
import { Location } from '@angular/common';
import { Moment } from 'moment';
import { PictureManageComponent } from './picture-manage/picture-manage.component';
import { ShareBookingModelComponent } from './share-booking-model/share-booking-model.component';
import { SortDescriptor } from '@progress/kendo-data-query/dist/es/sort-descriptor';
import { TabsetComponent } from 'ngx-bootstrap';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { WangEditorComponent } from 'app/shared/common/wang-editor/wang-editor.component';
import { WeChatShareTimelineService } from 'shared/services/wechat-share-timeline.service';
import { appModuleSlowAnimation } from 'shared/animations/routerTransition';

@Component({
    selector: 'app-create-or-edit-booking',
    templateUrl: './create-or-edit-booking.component.html',
    styleUrls: ['./create-or-edit-booking.component.scss'],
    animations: [appModuleSlowAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class CreateOrEditBookingComponent extends AppComponentBase implements OnInit, AfterViewInit {
    groupId: number = DefaultUploadPictureGroundId.BookingGroup;
    bookingId: number;
    timeBaseInfoForm: FormGroup;
    bookingBaseInfoForm: FormGroup;
    editingIndex: boolean[] = [];
    startHourOfDay = '00:00';
    endHourOfDay = '00:00';
    baseInfoDesc: string;

    selectOutletId: number;
    selectContactorId: number;
    outletSelectListData: SelectListItemDto[];
    contactorSelectListData: SelectListItemDto[];
    outletSelectDefaultItem: string;
    contactorSelectDefaultItem: string;

    formVaild: boolean;
    timeInfoFormValid: boolean;
    originalinput: CreateOrUpdateBookingInput = new CreateOrUpdateBookingInput();
    input: CreateOrUpdateBookingInput = new CreateOrUpdateBookingInput();

    // display field
    isEditing = false;
    isNew = true;
    saving = false;
    savingAndEditing = false;
    nextIndex = 1;
    isShowImperfectTip = false; // 是否显示完善机构信息弹窗
    needImperfectOutlet = false; // 是否显示补充门店信息弹窗

    /* 移动端代码开始 */
    // 保存本地时间段
    dafaultDate: string;
    editingBookingItem: BookingItemEditDto = new BookingItemEditDto();
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild('shareBookingModel') shareBookingModel: ShareBookingModelComponent;
    @ViewChild('pictureManageModel') pictureManageModel: PictureManageComponent;
    @ViewChild('wangEditorModel') wangEditorModel: WangEditorComponent;
    /* 移动端代码结束 */

    // 定时器
    interval: NodeJS.Timer;

    @ViewChild('bookingDes') _bookingDes: ElementRef;
    constructor(
        injector: Injector,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private _pictureServiceProxy: PictureServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _tenantInfoServiceProxy: TenantInfoServiceProxy,
        private _organizationBookingServiceProxy: OrgBookingServiceProxy,
        private _weChatShareTimelineService: WeChatShareTimelineService,
        private _localStorageService: LocalStorageService,
        private _route: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookingId = +this._route.snapshot.paramMap.get('id');
        this.loadData();
        this.getTenantInfo();
        this.initFormValidation();
        this.editingBookingItem.availableDates = this.dafaultDate = moment().format('YYYY-MM-DD');
    }

    ngAfterViewInit() {
        this.initFlatpickr();
    }

    // 响应式表单验证
    initFormValidation(): void {
        this.bookingBaseInfoForm = new FormGroup({
            bookingName: new FormControl(this.input.booking.name, [
                Validators.required,
                Validators.maxLength(10),
            ]),
        });

        this.timeBaseInfoForm = new FormGroup({
            maxBookingNum: new FormControl(this.editingBookingItem.maxBookingNum, [
                Validators.required,
            ]),
            maxQueueNum: new FormControl(this.editingBookingItem.maxQueueNum, [
                Validators.required,
            ])
        });
    }
    get bookingName() { return this.bookingBaseInfoForm.get('bookingName'); }
    get maxBookingNum() { return this.timeBaseInfoForm.get('maxBookingNum'); }
    get maxQueueNum() { return this.timeBaseInfoForm.get('maxQueueNum'); }

    back() {
        this._router.navigate(['/booking']);
    }

    /**
    * desktop
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
            this.checkDataNeed2Reconvert();
            this.loadOutletData();
            return;
        }

        this._organizationBookingServiceProxy
            .getBookingForEdit(this.bookingId)
            .subscribe(result => {
                this.input.booking = result.booking;
                this.input.items = result.items;
                this.input.bookingPictures = result.bookingPictures;
                this.baseInfoDesc = this.input.booking.description;
                this.initFormValidation();
                if (this.isMobile($('.mobile-create-booking'))) {
                    this.isNew = false;
                }
                this.loadOutletData();

                this.checkDataNeed2Reconvert();
                this.initWechatShareConfig();
                this.timeInfoFormValid = true;
            });
    }

    // 获取门店下拉框数据源
    loadOutletData() {
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.outletSelectListCache, this._sessionService.tenantId), () => {
            return this._outletServiceServiceProxy.getOutletSelectList()
        }).then(outletResult => {
            if (outletResult.length <= 0) {
                this.needImperfectOutlet = true;
            } else {
                this.outletSelectDefaultItem = this.input.booking.outletId ? this.input.booking.outletId.toString() : outletResult[0].value;
                this.outletSelectListData = outletResult;
                this.input.booking.outletId = this.selectOutletId = +this.outletSelectDefaultItem;
                this._localStorageService.getItem(abp.utils.formatString(AppConsts.contactorSelectListCache, this._sessionService.tenantId, this.selectOutletId), () => {
                    return this._outletServiceServiceProxy.getContactorSelectList(+this.outletSelectDefaultItem)
                }).then(contactorResult => {
                    if (contactorResult.length <= 0) { return; }
                    this.contactorSelectDefaultItem = this.input.booking.contactorId ? this.input.booking.contactorId.toString() : contactorResult[0].value;
                    this.contactorSelectListData = contactorResult;
                    this.input.booking.contactorId = this.selectContactorId = +this.contactorSelectDefaultItem;
                    this.getBookingBaseInfo();
                    this.originalinput = _.cloneDeep(this.input);
                })
            }
        })
    }

    save() {
        this.setLoadingStatus();
        this.createOrUpdateBooking();
    }

    saveAndEdit() {
        this.setLoadingStatus(true);
        this.createOrUpdateBooking(true);
    }

    createOrUpdateBooking(saveAndEdit: boolean = false) {
        if (!this.formValid()) { return; }

        this.getBookingBaseInfo();
        this.wangEditorModel.save(); // 保存编辑器图片到七牛
        debugger;
        this._organizationBookingServiceProxy
            .createOrUpdateBooking(this.input)
            .finally(() => {
                this.clearLoadingStatus();
            })
            .subscribe((result) => {
                // this.bookingId = result.id;
                abp.event.trigger('bookingListSelectChanged');
                this.removeTempCache(); // 清理缓存数据

                if (saveAndEdit) {
                    this.notify.success(this.l('SavaSuccess'));
                    if (this.bookingId > 0) {
                        return;
                    }
                    this._router.navigate([this.getBookingEditUrl(result.id)]);
                }

                if (this.isMobile($('.mobile-create-booking'))) {
                    const isUpdate = this.input.booking.id ? true : false;
                    this.routeToSuccess(result.id, isUpdate);
                } else {
                    this.shareBookingModel.show(result.id);
                }
            });
    }

    // 更新数据到DTO
    getBookingBaseInfo() {
        this.input.booking.id = this.bookingId <= 0 ? undefined : this.bookingId;
        this.input.booking.name = this.bookingBaseInfoForm.value.bookingName;
        this.input.booking.outletId = this.selectOutletId;
        this.input.booking.contactorId = this.selectContactorId;
        this.input.booking.isActive = true;
        this.wangEditorModel.getBaseInfoDesc();
    }

    // 获取预约时间项
    getTimeInfoInput(allBookingTime: BookingItemEditDto[]) {
        this.input.items = allBookingTime;
    }

    // 获取时间项表单验证结果
    getTimeInfoFormValid(timeInfoFormValid: boolean) {
        this.timeInfoFormValid = timeInfoFormValid;
    }

    // 门店选择事件
    public outletChange(outlet: any): void {
        this.selectOutletId = parseInt(outlet, null);
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.contactorSelectListCache, this._sessionService.tenantId, this.selectOutletId), () => {
            return this._outletServiceServiceProxy.getContactorSelectList(this.selectOutletId)
        }).then(result => {
            this.contactorSelectListData = result;
            this.contactorSelectDefaultItem = result[0].value;
            this.selectContactorId = +result[0].value;
        })
    }

    // 联系人选择事件
    public contactorChange(contactor: any): void {
        this.selectContactorId = parseInt(contactor, null);
    }

    // 选择图片事件
    pictureListChangeHandler(pictureForEdit: BookingPictureEditDto[]) {
        this.input.bookingPictures = pictureForEdit;
    }

    // 富文本编辑器回调事件
    editorContentChangeHandler($event: string): void {
        this.input.booking.description = $event;
    }

    // 移动端代码
    initFlatpickr() {
        const self = this;
        if ($('#createTimeFlatpickr')) {
            $('#createTimeFlatpickr').flatpickr({
                disableMobile: false,
                wrap: true,
                'locale': LocalizationHelper.getFlatpickrLocale(),
                defaultDate: self.dafaultDate,
                onOpen: (dateObj, dateStr) => {
                    this.editingBookingItem.availableDates = null;
                }
            })
        }
    }

    // 删除图片
    removeBookingPic(picIndex: number): void {
        this.input.bookingPictures.splice(picIndex, 1);
    }

    // 下一步
    nextStep(): void {
        this.staticTabs.tabs[this.nextIndex].active = true;
    }

    // tab点击的时候更新索引值
    updateNextIndex(index: number): void {
        this.nextIndex = index;
        this.refreshData();
    }

    // 显示提交按钮
    isShowConfirm(): boolean {
        if (this.nextIndex === 3) {
            return true;
        }
        return false;
    }

    // 显示添加时间面板
    createTimeField(): void {
        this.isNew = true;
        this.editingBookingItem.availableDates = this.dafaultDate = moment().format('YYYY-MM-DD');
        this.initFormValidation();
        setTimeout(() => {
            this.initFlatpickr();
        }, 100);
    }

    // 保存时间到队列
    savePanelTimeField(): void {
        this.isNew = false;
        this.timeInfoFormValid = true;
        this.editingBookingItem.isActive = true;
        this.editingBookingItem.hourOfDay = this.startHourOfDay + '-' + this.endHourOfDay;
        this.editingBookingItem.maxBookingNum = this.timeBaseInfoForm.value.maxBookingNum;
        this.editingBookingItem.maxQueueNum = this.timeBaseInfoForm.value.maxQueueNum;
        this.input.items.push(this.editingBookingItem);
        this.startHourOfDay = '00:00';
        this.endHourOfDay = '00:00';

        this.editingBookingItem = new BookingItemEditDto();
    }

    // 编辑时间项
    editingTimeField(index: number): void {
        this.editingIndex[index] = true;
    }

    // 删除时间项
    deleteTimeField(index: number): void {
        this.input.items.splice(index, 1);
        if (this.input.items.length <= 0) {
            this.isNew = true;
        }
    }

    // 保存时间项
    saveTimeField(index: number): void {
        this.editingIndex[index] = false;
    }

    // 上传图片事件
    getPicUploadInfoHandler(allPicUploadInfo: BookingPictureEditDto[]): void {
        this.input.bookingPictures = allPicUploadInfo;
    }

    // 刷新数据（由于使用模型驱动表单验证，所以需要更新数据到DTO）
    refreshData(): void {
        this.input.booking.name = this.bookingBaseInfoForm.value.bookingName;
    }

    /* 业务代码 */
    initWechatShareConfig() {
        if (this.input.booking && this.isWeiXin()) {
            this._weChatShareTimelineService.input.sourceUrl = document.location.href;
            this._weChatShareTimelineService.input.title = this.l('ShareMyBooking', this.input.booking.name);
            this._weChatShareTimelineService.input.desc = this.l(this.input.booking.name);
            this._weChatShareTimelineService.input.imgUrl = AppConsts.appBaseUrl + '/assets/common/images/logo.jpg';
            this._weChatShareTimelineService.input.link = AppConsts.userCenterUrl + '/booking/' + this.bookingId;
            this._weChatShareTimelineService.initWeChatShareConfig();
        }
    }

    // 检查数据是否需要恢复
    checkDataNeed2Reconvert() {
        this._localStorageService.getItemOrNull<CreateOrUpdateBookingInput>(this.getTemCacheItemKey())
            .then((editCache) => {
                this.getBookingBaseInfo();
                if (editCache && this.isDataNoEqual(editCache, this.input)) {
                    this.message.confirm(this.l('TemporaryData.Unsaved'), this.l('TemporaryData.Recover'), (confirm) => {
                        if (confirm) {
                            this.input = editCache;
                            this.originalinput = _.cloneDeep(this.input);
                            this.initFormValidation();
                            this.loadOutletData();
                        }
                        this.removeTempCache();
                    });
                }
                this.startSaveEditInfoInBower();
            });
    }

    // 开始定时保存临时数据
    startSaveEditInfoInBower() {
        this.interval = setInterval(() => {
            if (this.isEmptyData(this.input)) {
                this.removeTempCache()
            } else if (this.isTemDataNeedSave()) {
                this._localStorageService.setItem(this.getTemCacheItemKey(), this.input);
                this.originalinput = _.cloneDeep(this.input);
            }
        }, 3000)
    }

    // 数据是否需要保存
    isTemDataNeedSave(): boolean {
        this.getBookingBaseInfo();
        return this.isDataNoEqual(this.originalinput, this.input);
    }

    // 数据是否相等
    isDataNoEqual(source: CreateOrUpdateBookingInput, destination: CreateOrUpdateBookingInput): boolean {
        // 编辑预约时判断
        if (source.booking.id !== destination.booking.id) { this.removeTempCache(); return false; }

        return JSON.stringify(source) !== JSON.stringify(destination);
    }

    // 是否空对象
    isEmptyData(input: CreateOrUpdateBookingInput) {
        let isEmpty = true;

        if (input.booking) {
            if (input.booking.name) { isEmpty = false; }
            if (this.isEmtyDescription(input.booking.description)) { isEmpty = false; }
            if (input.booking.outletId > 0) { isEmpty = false; }
            if (input.booking.contactorId > 0) { isEmpty = false; }

        }
        if (input.bookingPictures && input.bookingPictures.length > 0) { isEmpty = false; }
        if (input.items && input.items.length > 0) { isEmpty = false; }
        return isEmpty;
    }

    // 删除临时数据
    removeTempCache() {
        this._localStorageService.removeItem(this.getTemCacheItemKey());
    }


    // 获取临时数据key
    getTemCacheItemKey() {
        return abp.utils.formatString(AppConsts.templateEditStore.booking, this._sessionService.tenantId);
    }

    // 验证表单
    formValid(): boolean {
        if (this.bookingBaseInfoForm.invalid) {
            if (this.isMobile($('.mobile-create-booking'))) {
                this.message.warn(this.l('Booking.BaseInfo.Required'));
                this.staticTabs.tabs[0].active = true;
            } else {
                this.message.error('', this.l('Booking.BaseInfo.Required'));
                this.clearLoadingStatus();
            }
            return false;
        }

        if (this.input.items.length < 1) {
            if (this.isMobile($('.mobile-create-booking'))) {
                this.message.warn(this.l('Booking.TimeInfo.Required'));
                this.staticTabs.tabs[1].active = true;
            } else {
                this.message.error('', this.l('Booking.TimeInfo.Required'));
                this.clearLoadingStatus();
            }
            return false;
        }

        if (!this.timeInfoFormValid) {
            this.message.error('', this.l('Booking.TimeInfo.NotSaved'));
            this.clearLoadingStatus();
            return false;
        }

        return true;
    }

    // 设置loading状态
    setLoadingStatus(editing: boolean = false) {
        if (editing) {
            this.savingAndEditing = false;
        } else {
            this.saving = false;
        }
    }

    // 清除loading状态
    clearLoadingStatus() {
        this.saving = false;
        this.savingAndEditing = false;
    }

    // 跳转编辑预约
    routeToSuccess(bookingId: number, isUpdate: boolean): void {
        const url = `/booking/succeed/${bookingId}/${isUpdate}`;
        if (!ClientTypeHelper.isWeChatMiniProgram) {
            this._router.navigate([url]);
        } else {
            wx.miniProgram.redirectTo({
                url: `/pages/business-center/business-center?route=${encodeURIComponent(url)}`
            })
        }
    }

    getBookingEditUrl(bookingId: number): string {
        return `/booking/edit/${bookingId}`;
    }

    isEmtyDescription(description) {
        return !description || description === '<p><br></p>';
    }
}
