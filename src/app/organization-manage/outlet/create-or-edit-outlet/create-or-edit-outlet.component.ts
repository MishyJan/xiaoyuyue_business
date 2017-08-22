import { Component, Injector, OnInit } from '@angular/core';
import { ContactorEditDto, CreateOrUpdateOutletInput, OutletEditDto, OutletServiceServiceProxy, SelectListItemDto, StateServiceServiceProxy } from 'shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { Router } from '@angular/router';
import { SelectHelper } from 'shared/helpers/SelectHelper';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-create-or-edit-outlet',
    templateUrl: './create-or-edit-outlet.component.html',
    styleUrls: ['./create-or-edit-outlet.component.scss'],
    animations: [accountModuleAnimation()],
})
export class CreateOrEditOutletComponent extends AppComponentBase implements OnInit {
    savingAndEditing: boolean;
    saving = false;
    onlineAllContactors: ContactorEditDto[];
    contactorEdit: ContactorEditDto[];
    selectedDistrictId: string;
    selectedCityId: string;
    selectedProvinceId: string;

    districtId: number;
    cityId: number;
    provinceId: number;

    defaultItem: SelectListItemDto = new SelectListItemDto();

    isCitySelect = false;
    isDistrictSelect = false;

    provinceSelectListData: SelectListItemDto[] = [];
    citysSelectListData: SelectListItemDto[];
    districtSelectListData: SelectListItemDto[];

    input: CreateOrUpdateOutletInput = new CreateOrUpdateOutletInput();
    outetInfo: OutletEditDto = new OutletEditDto();

    startShopHours: any;
    endShopHours: any;

    pictureInfo: UploadPictureDto = new UploadPictureDto();

    href: string = document.location.href;
    outletId: any = +this.href.substr(this.href.lastIndexOf('/') + 1, this.href.length);
    constructor(
        injector: Injector,
        private _router: Router,
        private _stateServiceServiceProxy: StateServiceServiceProxy,
        private _outletServiceServiceProxy: OutletServiceServiceProxy
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
        this.provinceSelectListData.unshift(SelectHelper.DefaultSelectList());
        this.selectedProvinceId = this.provinceSelectListData[0].value;
        this.loadData();
    }

    loadData(): void {
        if (!this.outletId) {
            return;
        }

        this._outletServiceServiceProxy
            .getOutletForEdit(this.outletId)
            .subscribe(result => {
                this.contactorEdit = this.onlineAllContactors = result.contactors;

                this.outetInfo.pictureId = this.pictureInfo.pictureId = result.outlet.pictureId;
                this.outetInfo.pictureUrl = this.pictureInfo.pictureUrl = result.outlet.pictureUrl;

                this.outetInfo.name = result.outlet.name;
                this.outetInfo.detailAddress = result.outlet.detailAddress;
                this.outetInfo.phoneNum = result.outlet.phoneNum;

                this.startShopHours = result.outlet.businessHours.split(' ')[0];
                this.endShopHours = result.outlet.businessHours.split(' ')[1];

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

        this.outetInfo.id = this.outletId ? this.outletId : 0;

        this.outetInfo.businessHours = this.startShopHours + ' ' + this.endShopHours;
        this.outetInfo.provinceId = this.provinceId;
        this.outetInfo.cityId = this.cityId;
        this.outetInfo.districtId = this.districtId;
        this.outetInfo.isActive = true;

        this.input.outlet = this.outetInfo;
        this.input.contactors = this.contactorEdit;

        this.saving = true;
        this._outletServiceServiceProxy
            .createOrUpdateOutlet(this.input)
            .finally(() => this.saving = false)
            .subscribe(result => {
                this.notify.success('保存成功');
                this._router.navigate(['/outlet/list']);
            })
    }

    saveAndEdit() {
        this.outetInfo.id = this.outletId ? this.outletId : 0;

        this.outetInfo.businessHours = this.startShopHours + ' ' + this.endShopHours;
        this.outetInfo.provinceId = this.provinceId;
        this.outetInfo.cityId = this.cityId;
        this.outetInfo.districtId = this.districtId;
        this.outetInfo.isActive = true;

        this.input.outlet = this.outetInfo;
        this.input.contactors = this.contactorEdit;
        this.savingAndEditing = true;
        this._outletServiceServiceProxy
            .createOrUpdateOutlet(this.input)
            .finally(() => { this.savingAndEditing = false })
            .subscribe(() => {
                this.notify.success('保存成功!');
            });
    }


    getProvinceSelectList(provinceId?: number): void {
        this._stateServiceServiceProxy
            .getProvinceSelectList()
            .subscribe(result => {
                this.provinceSelectListData = result;
                this.provinceSelectListData.unshift(this.defaultItem);
                this.selectedProvinceId = this.provinceSelectListData[0].value;
                this.provinceId = parseInt(this.selectedProvinceId, null);
            })
    }

    getCitysSelectList(provinceId: number): void {
        if (!parseInt(this.selectedProvinceId, null)) {
            return;
        }
        this._stateServiceServiceProxy
            .getCitySelectList(this.provinceId)
            .subscribe(result => {
                this.citysSelectListData = result;
                this.citysSelectListData.unshift(this.defaultItem);
                this.selectedCityId = this.citysSelectListData[1].value;
                this.cityId = parseInt(this.selectedCityId, null);
                this.getDistrictsSelectList(this.cityId);
            })

    }

    getDistrictsSelectList(cityId: number): void {
        if (!this.cityId) {
            return;
        }
        this._stateServiceServiceProxy
            .getDistrictSelectList(cityId)
            .subscribe(result => {
                this.districtSelectListData = result;
                this.districtSelectListData.unshift(this.defaultItem);
                if (result.length <= 0) {
                    this.isDistrictSelect = false;
                    this.selectedDistrictId = '';
                    this.districtId = 0;
                } else {
                    this.selectedDistrictId = this.districtSelectListData[1].value;
                    this.districtId = parseInt(this.selectedDistrictId, null);
                }
            })
    }

    public provinceSelectHandler(provinceId: any): void {
        this.provinceId = parseInt(provinceId, null);
        if (this.provinceId <= 0) {
            this.isCitySelect = false;
            this.isDistrictSelect = false;
            this.selectedCityId = this.defaultItem.value;
            this.selectedDistrictId = this.defaultItem.value;
        } else {
            this.isCitySelect = true;
            this.isDistrictSelect = true;
            this.getCitysSelectList(provinceId);
        }
    }
    public citySelectHandler(cityId: any): void {
        this.cityId = parseInt(cityId, null);
        this.getDistrictsSelectList(this.cityId);
    }

    public districtSelectHandler(districtId: any): void {
        this.districtId = parseInt(districtId, null);
    }

    public openProvinceSledct(): void {
        this.getProvinceSelectList();
    }

    getPictureInfo(uploadPicInfo: UploadPictureDto): void {
        this.outetInfo.pictureId = uploadPicInfo.pictureId;
        this.outetInfo.pictureUrl = uploadPicInfo.pictureUrl.changingThisBreaksApplicationSecurity;
    }

    getContactorEdit(contactorEdit: ContactorEditDto[]) {
        this.contactorEdit = contactorEdit;
    }
}
