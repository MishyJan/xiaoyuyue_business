import * as _ from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContactorEditDto, CreateOrUpdateOutletInput, GetOutletForEditDto, OutletEditDto, OutletServiceServiceProxy, SelectListItemDto, StateServiceServiceProxy } from 'shared/service-proxies/service-proxies';
import { IDailyDataStatistics, IListResultDtoOfLinkedUserDto } from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { BusinessHour } from 'app/shared/utils/outlet-display.dto';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { LocalStorageService } from '@shared/utils/local-storage.service';
import { PictureUrlHelper } from '@shared/helpers/PictureUrlHelper';
import { SelectHelper } from 'shared/helpers/SelectHelper';
import { TabsetComponent } from 'ngx-bootstrap';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { test } from '@shared/animations/gridToggleTransition';

@Component({
    selector: 'xiaoyuyue-create-or-edit-outlet',
    templateUrl: './create-or-edit-outlet.component.html',
    styleUrls: ['./create-or-edit-outlet.component.scss'],
    animations: [accountModuleAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class CreateOrEditOutletComponent extends AppComponentBase implements OnInit {
    outletId: string;
    groupId: number = DefaultUploadPictureGroundId.OutletGroup;

    outletForEdit: GetOutletForEditDto = new GetOutletForEditDto(); // 传输地址下拉框数据用 TODO:修改api，改为从统一接口获取
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
        this.provinceSelectListData.unshift(SelectHelper.DefaultSelectList());
        this.selectedProvinceId = this.provinceSelectListData[0].value;
        this.loadData();
    }

    loadData(): void {
        if (!this.isCreateOrEditFlag) {
            this.checkDataNeed2Reconvert();
            this.startSaveEditInfoInBower();
            return;
        }

        this._outletServiceServiceProxy
            .getOutletForEdit(+this.outletId)
            .subscribe(result => {
                this.outletForEdit = result;
                this.input.outlet = result.outlet;
                this.input.contactors = result.contactors;
                this.originalinput = _.cloneDeep(this.input);

                this.initDataToDisplay(result);

                this.checkDataNeed2Reconvert(); // 检查数据是否需要恢复

                this.startSaveEditInfoInBower(); // 开始保存临时数据
            })
    }

    checkDataNeed2Reconvert() {
        this._localStorageService.getItemOrNull<CreateOrUpdateOutletInput>(abp.utils.formatString(AppConsts.templateEditStore.outlet, this._sessionService.tenantId))
            .then((editCache) => {
                if (editCache && this.isDataNoEqual(editCache, this.input)) {
                    this.message.confirm('检查到有未保存数据!', '是否恢复数据', (confirm) => {
                        if (confirm) {
                            this.input = editCache;
                            this.initOutletInfoToDisplay(this.input.outlet);
                            this.originalinput = _.cloneDeep(this.input);
                        } else {
                            this.removeEditCache();
                        }
                    });
                }
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

        if (this.input.contactors.length < 1) {
            this.notify.warn('请添加联系人');
            this.savingAndEditing = false
            return;
        }
        this._outletServiceServiceProxy
            .createOrUpdateOutlet(this.input)
            .finally(() => { this.savingAndEditing = false })
            .subscribe(() => {
                abp.event.trigger('outletListSelectChanged');
                abp.event.trigger('contactorListSelectChanged');
                this.notify.success('保存成功!');
                if (!saveAndEdit) { this._router.navigate(['/outlet/list']); }
            });
    }

    removeOutlet(): void {
        this.message.confirm('确定要删除此门店?', (result) => {
            if (result) {
                this.deleting = true;
                this._outletServiceServiceProxy
                    .deleteOutlet(+this.outletId)
                    .finally(() => { this.deleting = false })
                    .subscribe(() => {
                        this.notify.success('门店删除成功');
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
            if (this.isDataNoSave()) {
                this._localStorageService.setItem(abp.utils.formatString(AppConsts.templateEditStore.outlet, this._sessionService.tenantId), this.input);
                this.originalinput = _.cloneDeep(this.input);
            }
        }, 3000)
    }

    isDataNoSave(): boolean {
        this.input.outlet.businessHours = this.businessHour.GetBusinessHourString();
        return this.isDataNoEqual(this.originalinput, this.input);
    }

    isDataNoEqual(source: CreateOrUpdateOutletInput, destination: CreateOrUpdateOutletInput): boolean {
        if (!source.outlet.id && destination.outlet.id) { return false; }

        if (source.outlet.id !== destination.outlet.id) { return false; }

        return JSON.stringify(source) !== JSON.stringify(destination);
    }

    removeEditCache() {
        this._localStorageService.removeItem(abp.utils.formatString(AppConsts.templateEditStore.outlet, this._sessionService.tenantId));
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


}
