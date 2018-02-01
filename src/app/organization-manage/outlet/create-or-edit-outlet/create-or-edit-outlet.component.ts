import * as _ from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContactorEditDto, CreateOrUpdateOutletInput, GetOutletForEditDto, OutletEditDto, OutletServiceServiceProxy, SelectListItemDto, StateServiceServiceProxy } from 'shared/service-proxies/service-proxies';
import { IDailyDataStatistics, IListResultDtoOfLinkedUserDto } from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BusinessHour } from 'app/shared/utils/outlet-display.dto';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { PictureUrlHelper } from '@shared/helpers/PictureUrlHelper';
import { TabsetComponent } from 'ngx-bootstrap';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { test } from '@shared/animations/gridToggleTransition';
import { SelectHelperService } from 'shared/services/select-helper.service';

@Component({
    selector: 'xiaoyuyue-create-or-edit-outlet',
    templateUrl: './create-or-edit-outlet.component.html',
    styleUrls: ['./create-or-edit-outlet.component.scss'],
    animations: [accountModuleAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class CreateOrEditOutletComponent extends AppComponentBase implements OnInit, AfterViewInit {
    zdNum: string;
    telephoneNum: string;
    isValidLandlinePhone: boolean;
    outletId: string;
    groupId: number = DefaultUploadPictureGroundId.OutletGroup;

    input: CreateOrUpdateOutletInput = new CreateOrUpdateOutletInput();
    originalinput: CreateOrUpdateOutletInput;

    selectedDistrictId: string;
    selectedCityId: string;
    selectedProvinceId: string;
    isCitySelect = false;
    isDistrictSelect = false;
    provinceSelectListData: SelectListItemDto[] = [];
    citysSelectListData: SelectListItemDto[];
    districtSelectListData: SelectListItemDto[];

    businessHour: BusinessHour = new BusinessHour();
    pictureInfo: UploadPictureDto = new UploadPictureDto();

    // display field
    isCreateOrEditFlag: boolean;
    nextIndex = 1;
    deleting = false;
    savingAndEditing = false;
    saving = false;

    // 定时器
    interval: NodeJS.Timer;

    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    constructor(
        injector: Injector,
        private _route: ActivatedRoute,
        private _router: Router,
        private _selectHelper: SelectHelperService,
        private _stateServiceServiceProxy: StateServiceServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy,
        private _localStorageService: LocalStorageService,
        private _sessionService: AppSessionService

    ) {
        super(
            injector
        );

        this.input.outlet = new OutletEditDto();
        this.input.contactors = [];
        this.originalinput = _.cloneDeep(this.input);
    }

    ngOnInit() {
        this.outletId = this._route.snapshot.paramMap.get('id');
        this.isCreateOrEditState();
        this.provinceSelectListData.unshift(this._selectHelper.defaultSelectList());
        this.selectedProvinceId = this.provinceSelectListData[0].value;
        this.loadData();
    }

    ngAfterViewInit() {
        this.initValidZdNum();
        this.initValidTelephoneNum();
        this.initStartBusinessHour();
        this.initEndBusinessHour();
    }

    loadData(): void {
        if (!this.isCreateOrEditFlag) {
            this.checkDataNeed2Reconvert();
            return;
        }

        this._outletServiceServiceProxy
            .getOutletForEdit(+this.outletId)
            .subscribe(result => {
                this.input.outlet = result.outlet;
                this.input.contactors = result.contactors;
                this.originalinput = _.cloneDeep(this.input);
                this.splitLandlingPhone(this.input.outlet.phoneNum);

                this.initDataToDisplay(result);
                this.checkDataNeed2Reconvert(); // 检查数据是否需要恢复
            })
    }

    save(): void {
        this.saving = true;
        this.createOrUpdateOutlet();
    }

    saveAndEdit() {
        this.savingAndEditing = true;
        this.createOrUpdateOutlet(true);
    }

    createOrUpdateOutlet(saveAndEdit: boolean = false) {
        this.input.outlet.businessHours = this.businessHour.GetBusinessHourString();
        this.input.outlet.isActive = true;
        // 移动端暂时未作inputmask初始化，如果zdNum或者telephoneNum有一个为undefined就赋空值
        this.input.outlet.phoneNum = this.zdNum || this.telephoneNum ? this.zdNum + ' ' + this.telephoneNum : '';
        // 仅在用户输入座机号，才去验证有效性（保证可空也能创建门店）
        if ((this.zdNum || this.telephoneNum) && !this.isValidLandlingPhone(this.input.outlet.phoneNum)) {
            this.message.warn(this.l('Verify.Telephone.Invalid'));
            this.input.outlet.phoneNum = '';
            return;
        }

        if (this.input.contactors.length < 1) {
            this.message.warn(this.l('Outlet.Contactor.Required'));
            this.savingAndEditing = false
            return;
        }
        this._outletServiceServiceProxy
            .createOrUpdateOutlet(this.input)
            .finally(() => { this.savingAndEditing = false })
            .subscribe(() => {
                abp.event.trigger('outletListSelectChanged');
                abp.event.trigger('contactorListSelectChanged');
                this.removeEditCache(); // 清理缓存数据
                this.message.success(this.l('SavaSuccess'));
                if (!saveAndEdit) { this._router.navigate(['/outlet/list']); }
            });
    }

    removeOutlet(): void {
        this.message.confirm(this.l('Outlet.Confirm2Delete'), (result) => {
            if (result) {
                this.deleting = true;
                this._outletServiceServiceProxy
                    .deleteOutlet(+this.outletId)
                    .finally(() => { this.deleting = false })
                    .subscribe(() => {
                        this.message.success(this.l('DeleteSuccess'));
                        // 清理缓存数据
                        this._localStorageService.removeItem(abp.utils.formatString(AppConsts.outletSelectListCache, this._sessionService.tenantId));
                        this._router.navigate(['/outlet/list']);
                    })
            }
        })
    }

    // 判断新建门店还是编辑门店状态
    isCreateOrEditState() {
        this.isCreateOrEditFlag = this.outletId == null ? false : true;
    }

    getOutletInfoHandler(outletInfo: OutletEditDto): void {
        if (outletInfo.longitude) { this.input.outlet.longitude = outletInfo.longitude; }
        if (outletInfo.detailAddress) { this.input.outlet.detailAddress = outletInfo.detailAddress; }
        if (outletInfo.provinceId) { this.input.outlet.provinceId = outletInfo.provinceId; }
        if (outletInfo.cityId) { this.input.outlet.cityId = outletInfo.cityId; }
        if (outletInfo.districtId) { this.input.outlet.districtId = outletInfo.districtId; }
    }

    getPictureInfo(uploadPicInfo: UploadPictureDto): void {
        this.input.outlet.pictureId = uploadPicInfo.pictureId;
        this.input.outlet.pictureUrl = uploadPicInfo.pictureUrl;
    }

    getContactorEdit(editingContactors: ContactorEditDto[]) {
        this.input.contactors = editingContactors;
    }

    /* hourOfDay = '10:00 - 12:00' */
    private checkHourOfDay(hourOfDay: string): BusinessHour {
        if (!hourOfDay) {
            hourOfDay = '00:00 - 00:00';
        }
        let tempHourOfDay = '';
        let tempStart = '';
        let tempEnd = '';
        let hourOfDayArr = [];

        hourOfDayArr = hourOfDay.split(' - ');
        tempStart = hourOfDayArr[0];
        tempEnd = hourOfDayArr[1];
        if (!this.isTime(tempStart)) { tempStart = '00:00'; };
        if (!this.isTime(tempEnd)) { tempEnd = '00:00'; };
        tempHourOfDay = tempStart + ' - ' + tempEnd;

        return new BusinessHour(tempStart, tempEnd);
    }

    private isTime(time: string): boolean {
        let temp = [];
        if (!time) { return; };
        temp = time.split(':');
        if (!isNaN(temp[0]) && !isNaN(temp[1])) { return true };
        return false;
    }

    /* 移动端代码 */
    nextStep(): void {
        this.staticTabs.tabs[this.nextIndex].active = true;
    }

    // tab点击的时候更新tab索引值 
    updateNextIndex(index: number): void {
        this.nextIndex = index;
        // this.refreshData();
    }

    isShowConfirm(): boolean {
        if (this.nextIndex === 3) {
            return true;
        }
        return false;
    }

    getProvinceSelectList(provinceId?: number): void {
        this._stateServiceServiceProxy
            .getProvinceSelectList()
            .subscribe(result => {
                this.provinceSelectListData = result;
                this.input.outlet.provinceId = parseInt(this.selectedProvinceId, null);
            })
    }

    getCitysSelectList(provinceId: number): void {
        if (!provinceId) {
            return;
        }
        this._stateServiceServiceProxy
            .getCitySelectList(this.input.outlet.provinceId)
            .subscribe(result => {
                this.citysSelectListData = result;
                this.selectedCityId = this.citysSelectListData[0].value;
                this.input.outlet.cityId = parseInt(this.selectedCityId, null);
                this.getDistrictsSelectList(this.input.outlet.cityId);
            })

    }

    getDistrictsSelectList(cityId: number): void {
        if (!cityId) {
            return;
        }
        this._stateServiceServiceProxy
            .getDistrictSelectList(cityId)
            .subscribe(result => {
                this.districtSelectListData = result;
                if (result.length <= 0) {
                    this.isDistrictSelect = false;
                    this.selectedDistrictId = '';
                    this.input.outlet.districtId = 0;
                } else {
                    this.selectedDistrictId = this.districtSelectListData[0].value;
                    this.input.outlet.districtId = parseInt(this.selectedDistrictId, null);
                }
            })
    }

    startSaveEditInfoInBower() {
        this.interval = setInterval(() => {
            if (this.isEmptyData(this.input)) {
                this.removeEditCache()
            } else if (this.isTemDataNeedSave()) {
                this._localStorageService.setItem(this.getCacheItemKey(), this.input);
                this.originalinput = _.cloneDeep(this.input);
            }
        }, 3000)
    }

    isTemDataNeedSave(): boolean {
        this.input.outlet.businessHours = this.businessHour.GetBusinessHourString();
        return this.isDataNoEqual(this.originalinput, this.input);
    }

    isEmptyData(input: CreateOrUpdateOutletInput): boolean {
        let isEmpty = true;

        if (input.outlet) {
            if (input.outlet.name) { isEmpty = false; }
            if (input.outlet.businessHours !== '00:00 - 00:00') { isEmpty = false; }
            if (input.outlet.pictureId > 0) { isEmpty = false; }
            if (input.outlet.provinceId > 0) { isEmpty = false; }
            if (input.outlet.cityId > 0) { isEmpty = false; }
            if (input.outlet.districtId > 0) { isEmpty = false; }
            if (input.outlet.detailAddress) { isEmpty = false; }
        }
        if (input.contactors && input.contactors.length > 0) { isEmpty = false; }
        return isEmpty;
    }

    isDataNoEqual(source: CreateOrUpdateOutletInput, destination: CreateOrUpdateOutletInput): boolean {
        if (source.outlet.id !== destination.outlet.id) { this.removeEditCache(); return false; }

        return JSON.stringify(source) !== JSON.stringify(destination);
    }

    removeEditCache() {
        this._localStorageService.removeItem(this.getCacheItemKey());
    }

    public provinceSelectHandler(provinceId: any): void {
        this.input.outlet.provinceId = parseInt(provinceId, null);
        if (this.input.outlet.provinceId <= 0) {
            this.isCitySelect = false;
            this.isDistrictSelect = false;
        } else {
            this.isCitySelect = true;
            this.isDistrictSelect = true;
            this.getCitysSelectList(provinceId);
        }
    }
    public citySelectHandler(cityId: any): void {
        this.input.outlet.cityId = parseInt(cityId, null);
        this.getDistrictsSelectList(cityId);
    }

    public districtSelectHandler(districtId: any): void {
        this.input.outlet.districtId = parseInt(districtId, null);
    }

    public openProvinceSledct(): void {
        this.getProvinceSelectList();
    }

    // 固话号码inputmask初始化
    private initValidTelephoneNum(): void {
        $('#telephoneNum').inputmask({
            mask: '9{4}-9{3,4}',
            oncomplete: () => {
                this.telephoneNum = this.getTelephoneNumInput();
            },
            onincomplete: () => {
                this.telephoneNum = this.getTelephoneNumInput();
            }
        });
    }
    // 固话区号inputmask初始化
    private initValidZdNum(): void {
        $('#zdNum').inputmask({
            mask: '(9{1,4})',
            oncomplete: () => {
                this.zdNum = this.getZdNumberInput();
            },
            onincomplete: () => {
                this.zdNum = this.getZdNumberInput();
            }
        });
    }

    // 营业开始时间inputmask初始化
    private initStartBusinessHour(): void {
        $('#startBusinessHour').inputmask({
            alias: 'hh:mm',
            'placeholder': this.l('HourAndMinute'),
            oncomplete: () => {
                this.businessHour.start = this.getStartBusinessHour();
                $('#endBusinessHour').focus();
            },
            onincomplete: () => {
                this.businessHour.start = '00:00';
            }
        });
    }

    // 营业结束时间inputmask初始化
    private initEndBusinessHour(): void {
        $('#endBusinessHour').inputmask({
            alias: 'hh:mm',
            'placeholder': this.l('HourAndMinute'),
            oncomplete: () => {
                this.businessHour.end = this.getEndBusinessHour();
            },
            onincomplete: () => {
                this.businessHour.end = '00:00';
            }
        });
    }

    checkDataNeed2Reconvert() {
        this._localStorageService.getItemOrNull<CreateOrUpdateOutletInput>(this.getCacheItemKey())
            .then((editCache) => {
                debugger;
                if (editCache && this.isDataNoEqual(editCache, this.input)) {
                    this.message.confirm(this.l('TemporaryData.Unsaved'), this.l('TemporaryData.Recover'), (confirm) => {
                        if (confirm) {
                            this.input = editCache;
                            this.initOutletInfoToDisplay(this.input.outlet);
                            this.originalinput = _.cloneDeep(this.input);
                        } else {
                            this.removeEditCache();
                        }
                    });
                }
                this.startSaveEditInfoInBower();
            });
    }

    // 初始化显示数据
    initDataToDisplay(result: GetOutletForEditDto) {
        this.provinceSelectListData = result.availableProvinces;
        this.citysSelectListData = result.availableCitys;
        this.districtSelectListData = result.availableDistricts;

        this.initOutletInfoToDisplay(result.outlet);
    }

    // 初始化门店显示数据
    initOutletInfoToDisplay(outlet: OutletEditDto) {
        this.pictureInfo.pictureId = outlet.pictureId;
        this.pictureInfo.pictureUrl = outlet.pictureUrl;
        this.businessHour = this.checkHourOfDay(outlet.businessHours);
        this.selectedProvinceId = outlet.provinceId + '';
        this.selectedCityId = outlet.cityId + '';
        this.selectedDistrictId = outlet.districtId + '';

        if (outlet.provinceId >= 0) {
            this.isCitySelect = true;
            this.isDistrictSelect = true;
        }
    }


    //  获取电话号码的input内容
    private getTelephoneNumInput(): string {
        let telephoneNum = $('#telephoneNum').val() + '';
        telephoneNum = telephoneNum.replace(/-/, '');
        return telephoneNum;
    }

    //  获取电话号码的input内容
    private getZdNumberInput(): string {
        let zdNum = $('#zdNum').val() + '';
        zdNum = zdNum.replace(/\(/, '');
        zdNum = zdNum.replace(/\)/, '');
        return zdNum;
    }

    private getStartBusinessHour(): string {
        const startBusinessHour = $('#startBusinessHour').val() + '';
        return startBusinessHour;
    }
    private getEndBusinessHour(): string {
        const endBusinessHour = $('#endBusinessHour').val() + '';
        return endBusinessHour;
    }

    private isValidLandlingPhone(num: string): boolean {
        const reg = /^((0\d{2,3}) )(\d{7,8})$/;
        return reg.test(num);
    }

    private splitLandlingPhone(num: string): void {
        if (!this.isValidLandlingPhone(num)) { return; }
        this.zdNum = num.split(' ')[0];
        this.telephoneNum = num.split(' ')[1];
    }

    private getCacheItemKey() {
        return abp.utils.formatString(AppConsts.templateEditStore.outlet, this._sessionService.tenantId);
    }
}
