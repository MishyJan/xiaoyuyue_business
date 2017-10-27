import { ActivatedRoute, Router } from '@angular/router';
import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContactorEditDto, CreateOrUpdateOutletInput, OutletEditDto, OutletServiceServiceProxy, SelectListItemDto, StateServiceServiceProxy, GetOutletForEditDto } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { PictureUrlHelper } from '@shared/helpers/PictureUrlHelper';
import { SelectHelper } from 'shared/helpers/SelectHelper';
import { TabsetComponent } from 'ngx-bootstrap';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-create-or-edit-outlet',
    templateUrl: './create-or-edit-outlet.component.html',
    styleUrls: ['./create-or-edit-outlet.component.scss'],
    animations: [accountModuleAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class CreateOrEditOutletComponent extends AppComponentBase implements OnInit {
    outletForEdit: GetOutletForEditDto = new GetOutletForEditDto();
    deleting = false;
    isCreateOrEditFlag: boolean;
    outletId: string;
    nextIndex = 1;
    savingAndEditing: boolean;
    saving = false;
    onlineAllContactors: ContactorEditDto[] = [];
    contactorEdit: ContactorEditDto[] = [];
    selectedDistrictId: string;
    selectedCityId: string;
    selectedProvinceId: string;

    districtId: number;
    cityId: number;
    provinceId: number;

    isCitySelect = false;
    isDistrictSelect = false;

    provinceSelectListData: SelectListItemDto[] = [];
    citysSelectListData: SelectListItemDto[];
    districtSelectListData: SelectListItemDto[];

    input: CreateOrUpdateOutletInput = new CreateOrUpdateOutletInput();
    outetInfo: OutletEditDto = new OutletEditDto();

    startShopHours: any = '00:00';
    endShopHours: any = '00:00';

    pictureInfo: UploadPictureDto = new UploadPictureDto();

    // href: string = document.location.href;
    // outletId: any = +this.href.substr(this.href.lastIndexOf('/') + 1, this.href.length);

    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    constructor(
        injector: Injector,
        private _route: ActivatedRoute,
        private _router: Router,
        private _stateServiceServiceProxy: StateServiceServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy
    ) {
        super(
            injector
        );
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
            return;
        }

        this._outletServiceServiceProxy
            .getOutletForEdit(+this.outletId)
            .subscribe(result => {
                this.outletForEdit = result;
                this.contactorEdit = this.onlineAllContactors = result.contactors;

                this.outetInfo.pictureId = this.pictureInfo.pictureId = result.outlet.pictureId;
                this.outetInfo.pictureUrl = this.pictureInfo.pictureUrl = PictureUrlHelper.getOutletInfoPicCompressUrl(result.outlet.pictureUrl);

                this.outetInfo.name = result.outlet.name;
                this.outetInfo.detailAddress = result.outlet.detailAddress;
                this.outetInfo.phoneNum = result.outlet.phoneNum;

                let hourOfDay = this.checkHourOfDay(result.outlet.businessHours);
                this.startShopHours = hourOfDay.split(' - ')[0];
                this.endShopHours = hourOfDay.split(' - ')[1];
                
                this.provinceSelectListData = result.availableProvinces;
                this.selectedProvinceId = result.outlet.provinceId + '';
                this.provinceId = result.outlet.provinceId;

                this.citysSelectListData = result.availableCitys;
                this.selectedCityId = result.outlet.cityId + '';
                this.cityId = result.outlet.cityId;

                this.districtSelectListData = result.availableDistricts;
                this.selectedDistrictId = result.outlet.districtId + '';
                this.districtId = result.outlet.districtId;

                if (result.outlet.provinceId >= 0) {
                    this.isCitySelect = true;
                    this.isDistrictSelect = true;
                }
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
        this.outetInfo.id = +this.outletId ? +this.outletId : 0;
        this.outetInfo.businessHours = this.startShopHours + ' - ' + this.endShopHours;
        this.outetInfo.provinceId = this.provinceId;
        this.outetInfo.cityId = this.cityId;
        this.outetInfo.districtId = this.districtId;
        this.outetInfo.isActive = true;

        this.input.outlet = this.outetInfo;
        this.input.contactors = this.contactorEdit;
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
        if (outletInfo.longitude) { this.outetInfo.longitude = outletInfo.longitude; }
        if (outletInfo.detailAddress) { this.outetInfo.detailAddress = outletInfo.detailAddress; }
        if (outletInfo.provinceId) { this.provinceId = outletInfo.provinceId; }
        if (outletInfo.cityId) { this.cityId = outletInfo.cityId; }
        if (outletInfo.districtId) { this.districtId = outletInfo.districtId; }
    }

    getPictureInfo(uploadPicInfo: UploadPictureDto): void {
        this.outetInfo.pictureId = uploadPicInfo.pictureId;
        this.outetInfo.pictureUrl = uploadPicInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    }

    getContactorEdit(contactorEdit: ContactorEditDto[]) {
        this.contactorEdit = contactorEdit;
    }

    /* hourOfDay = '10:00 - 12:00' */
    private checkHourOfDay(hourOfDay: string): string {
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

        return tempHourOfDay;

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

    getOutletBgInfo(outletBgInfo: UploadPictureDto): void {
        this.outetInfo.pictureId = outletBgInfo.pictureId;
        this.outetInfo.pictureUrl = outletBgInfo.pictureUrl;
    }

    isShowConfirm(): boolean {
        if (this.nextIndex === 3) {
            return true;
        }
        return false;
    }

    getProvinceSelectList(provinceId?: number): void {
        debugger
        this._stateServiceServiceProxy
            .getProvinceSelectList()
            .subscribe(result => {
                this.provinceSelectListData = result;
                this.provinceId = parseInt(this.selectedProvinceId, null);
            })
    }

    getCitysSelectList(provinceId: number): void {
        if (!provinceId) {
            return;
        }
        this._stateServiceServiceProxy
            .getCitySelectList(this.provinceId)
            .subscribe(result => {
                this.citysSelectListData = result;
                this.selectedCityId = this.citysSelectListData[0].value;
                this.cityId = parseInt(this.selectedCityId, null);
                this.getDistrictsSelectList(this.cityId);
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
                    this.districtId = 0;
                } else {
                    this.selectedDistrictId = this.districtSelectListData[0].value;
                    this.districtId = parseInt(this.selectedDistrictId, null);
                }
            })
    }

    public provinceSelectHandler(provinceId: any): void {
        this.provinceId = parseInt(provinceId, null);
        if (this.provinceId <= 0) {
            this.isCitySelect = false;
            this.isDistrictSelect = false;
        } else {
            this.isCitySelect = true;
            this.isDistrictSelect = true;
            this.getCitysSelectList(provinceId);
        }
    }
    public citySelectHandler(cityId: any): void {
        this.cityId = parseInt(cityId, null);
        this.getDistrictsSelectList(cityId);
    }

    public districtSelectHandler(districtId: any): void {
        this.districtId = parseInt(districtId, null);
    }

    public openProvinceSledct(): void {
        this.getProvinceSelectList();
    }
}
