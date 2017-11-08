import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, transition } from '@angular/core';
import { BookingEditDto, BookingItemEditDto, BookingPictureEditDto, CreateOrUpdateBookingInput, GetBookingForEditOutput, OrgBookingServiceProxy, OutletServiceServiceProxy, PagedResultDtoOfBookingListDto, PictureServiceProxy, SelectListItemDto, TenantInfoEditDto, TenantInfoServiceProxy } from 'shared/service-proxies/service-proxies';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { AbpSessionService } from '@abp/session/abp-session.service';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from 'shared/AppConsts';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { LocalStorageService } from 'shared/utils/local-storage.service';
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
export class CreateOrEditBookingComponent extends AppComponentBase implements OnInit, AfterViewInit, OnChanges {
    groupId: number = DefaultUploadPictureGroundId.BookingGroup;
    bookingId: number;
    timeBaseInfoForm: FormGroup;
    bookingBaseInfoForm: FormGroup;
    editingIndex: boolean[] = [];
    startHourOfDay = '00:00';
    endHourOfDay = '00:00';

    selectOutletId: number;
    selectContactorId: number;
    outletSelectListData: SelectListItemDto[];
    contactorSelectListData: SelectListItemDto[];

    formVaild: boolean;
    timeInfoFormValid: boolean;
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

    public outletSelectDefaultItem: string;
    public contactorSelectDefaultItem: string;

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

    ngOnChanges(changes: SimpleChanges) {
        // this.editingBookingItem.availableDates = this.dafaultDate;
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
            // 获取门店下拉框数据源
            this.loadOutletData();
            return;
        }

        this._organizationBookingServiceProxy
            .getBookingForEdit(this.bookingId)
            .subscribe(result => {
                this.input.booking = result.booking;
                this.input.items = result.items;
                this.input.bookingPictures = result.bookingPictures;
                this.initFormValidation();
                this.input.booking.needAge = result.booking.needAge;
                this.input.booking.needGender = result.booking.needGender;
                this.input.booking.needEmail = result.booking.needEmail;
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
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.outletSelectListCache, this._sessionService.tenantId), () => {
            return this._outletServiceServiceProxy.getOutletSelectList()
        }).then(outletResult => {
            if (outletResult.length <= 0) {
                this.needImperfectOutlet = true;
            } else {
                this.outletSelectDefaultItem = this.input.booking ? this.input.booking.outletId.toString() : outletResult[0].value;
                this.outletSelectListData = outletResult;
                this.selectOutletId = +this.outletSelectDefaultItem;
                this._localStorageService.getItem(abp.utils.formatString(AppConsts.contactorSelectListCache, this._sessionService.tenantId), () => {
                    return this._outletServiceServiceProxy.getContactorSelectList(+this.outletSelectDefaultItem)
                }).then(contactorResult => {
                    if (contactorResult.length <= 0) { return; }
                    this.contactorSelectDefaultItem = this.input ? this.input.booking.contactorId.toString() : contactorResult[0].value;
                    this.contactorSelectListData = contactorResult;
                    this.selectContactorId = +this.contactorSelectDefaultItem;
                })
            }
        })
    }

    save() {
        this.saving = true;
        this.wangEditorModel.save();
        this.createOrUpdateBooking();
    }

    saveAndEdit() {
        console.log(this.wangEditorModel);
        this.savingAndEditing = true;
        this.wangEditorModel.save();
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

        if (this.input.items.length < 1) {
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

        this.input.booking.needAge = this.input.booking.needAge;
        this.input.booking.needGender = this.input.booking.needGender;
        this.input.booking.needEmail = this.input.booking.needEmail;
        this.input.booking.name = this.bookingBaseInfoForm.value.bookingName;

        this.input.booking.id = this.bookingId ? this.bookingId : 0;
        this.input.booking.outletId = this.selectOutletId;
        this.input.booking.contactorId = this.selectContactorId;
        this.input.booking.isActive = true;
        // 判断是否有添加新的时间信息
        this.input.items = this.input.items;
        // 判断是否上传过图片
        this.input.bookingPictures = this.input.bookingPictures;

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
                    const isUpdate = this.bookingId ? true : false;
                    this._router.navigate(['/booking/succeed', result.id, isUpdate]);
                } else {
                    this.shareBookingModel.show(result.id);
                }
            });
    }

    getTimeInfoInput(allBookingTime: BookingItemEditDto[]) {
        this.input.items = allBookingTime;
    }

    getInfoFormValid(timeInfoFormValid: boolean) {
        this.timeInfoFormValid = timeInfoFormValid;
    }

    public outletChange(outlet: any): void {
        this.selectOutletId = parseInt(outlet, null);
        this._outletServiceServiceProxy
            .getContactorSelectList(this.selectOutletId)
            .subscribe(result => {
                this.contactorSelectListData = result;
                this.contactorSelectDefaultItem = result[0].value;
                this.selectContactorId = +result[0].value;
            })
    }

    public contactorChange(contactor: any): void {
        this.selectContactorId = parseInt(contactor, null);
    }

    getAllPictureForEdit(pictureForEdit: BookingPictureEditDto[]) {
        this.input.bookingPictures = pictureForEdit;
    }

    getEditorHTMLContent($event: string): void {
        this.input.booking.description = $event;
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
        this.input.bookingPictures.splice(picIndex, 1);
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
        this.editingBookingItem.availableDates = this.dafaultDate = moment().format('YYYY-MM-DD');
        this.initFormValidation();
        setTimeout(() => {
            this.initFlatpickr();
        }, 100);
    }

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

    getPicUploadInfoHandler(allPicUploadInfo: BookingPictureEditDto[]): void {
        this.input.bookingPictures = allPicUploadInfo;
    }

    editingTimeField(index: number): void {
        this.editingIndex[index] = true;
    }

    deleteTimeField(index: number): void {
        this.input.items.splice(index, 1);
    }

    saveTimeField(index: number): void {
        this.editingIndex[index] = false;
    }

    // 刷新数据（由于使用模型驱动表单验证，所以需要更新数据到DTO）
    refreshData(): void {
        this.input.booking.name = this.bookingBaseInfoForm.value.bookingName;
    }

    // PC端代码
    /* 业务代码 */
    initWechatShareConfig() {
        if (this.input.booking && this.isWeiXin()) {
            this._weChatShareTimelineService.input.sourceUrl = document.location.href;
            this._weChatShareTimelineService.input.title = this.l('ShareMyBooking', this.input.booking.name);
            this._weChatShareTimelineService.input.desc = this.l(this.input.booking.name);
            this._weChatShareTimelineService.input.imgUrl = AppConsts.appBaseUrl + '/assets/common/images/logo.jpg';
            this._weChatShareTimelineService.input.link = AppConsts.shareBaseUrl + '/booking/' + this.bookingId;
            this._weChatShareTimelineService.initWeChatShareConfig();
        }
    }
}
