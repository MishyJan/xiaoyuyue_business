import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { StateServiceServiceProxy, SelectListItemDto, CreateOrUpdateOutletInput, OutletServiceServiceProxy, OutletEditDto, ContactorEditDto } from 'shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { UploadPictureDto } from 'app/admin/shared/utils/upload-picture.dto';

@Component({
    selector: 'xiaoyuyue-create-or-edit-outlet',
    templateUrl: './create-or-edit-outlet.component.html',
    styleUrls: ['./create-or-edit-outlet.component.scss'],
    animations: [accountModuleAnimation()],
})
export class CreateOrEditOutletComponent extends AppComponentBase implements OnInit {
    savingAndEditing: boolean;
    saving: boolean = false;
    onlineAllContactors: ContactorEditDto[];
    contactorEdit: ContactorEditDto[];
    districtSelectDefaultItem: string;
    citySelectDefaultItem: string;
    provinceSelectDefaultItem: string;
    defaultItem: SelectListItemDto = new SelectListItemDto();

    cityId: number = 1;
    provinceId: number = 1;
    districtId: number = 0;

    isCitySelect: boolean = false;
    isDistrictSelect: boolean = false;

    provinceSelectListData: SelectListItemDto[] = [];
    citysSelectListData: SelectListItemDto[];
    districtSelectListData: SelectListItemDto[];

    input: CreateOrUpdateOutletInput = new CreateOrUpdateOutletInput();
    outetInfo: OutletEditDto = new OutletEditDto();

    startShopHours: any;
    endShopHours: any;

    pictureInfo: UploadPictureDto = new UploadPictureDto();

    href: string = document.location.href;
    outletId: any = +this.href.substr(this.href.lastIndexOf("/") + 1, this.href.length);
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
        this.defaultItem.text = "请选择";
        this.defaultItem.value = "0";
        this.provinceSelectListData.unshift(this.defaultItem);
        this.provinceSelectDefaultItem = this.provinceSelectListData[0].value;
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

                this.startShopHours = result.outlet.businessHours.split(" ")[0];
                this.endShopHours = result.outlet.businessHours.split(" ")[1];

                this.provinceSelectListData = result.availableProvinces;
                this.provinceSelectDefaultItem = result.outlet.provinceId + "";
                this.provinceId = parseInt(this.provinceSelectDefaultItem);

                this.citysSelectListData = result.availableCitys;
                this.citySelectDefaultItem = result.outlet.cityId + "";
                this.cityId = parseInt(this.citySelectDefaultItem);

                this.districtSelectListData = result.availableDistricts;
                this.districtSelectDefaultItem = result.outlet.districtId + "";
                this.districtId = parseInt(this.districtSelectDefaultItem);

                if (parseInt(this.provinceSelectDefaultItem) >= 0) {
                    this.isCitySelect = true;
                    this.isDistrictSelect = true;
                }
            })
    }

    save(): void {

        this.outetInfo.id = this.outletId ? this.outletId : 0;

        this.outetInfo.businessHours = this.startShopHours + " " + this.endShopHours;
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
                this.notify.success("保存成功");
                this._router.navigate(['/app/admin/org/list']);
            })
    }

    saveAndEdit() {
        this.outetInfo.id = this.outletId ? this.outletId : 0;

        this.outetInfo.businessHours = this.startShopHours + " " + this.endShopHours;
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
                this.notify.success("保存成功!");
            });
    }


    getProvinceSelectList(provinceId?: number): void {
        this._stateServiceServiceProxy
            .getProvinceSelectList()
            .subscribe(result => {
                this.provinceSelectListData = result;
                this.provinceSelectListData.unshift(this.defaultItem);
                this.provinceSelectDefaultItem = this.provinceSelectListData[0].value;
                this.provinceId = provinceId;
            })
    }

    getCitysSelectList(cityId?: number): void {
        if (!this.provinceId) {
            return;
        }
        this._stateServiceServiceProxy
            .getCitySelectList(this.provinceId)
            .subscribe(result => {
                this.citysSelectListData = result;
                this.citysSelectListData.unshift(this.defaultItem);
                this.citySelectDefaultItem = this.citysSelectListData[1].value;
                this.cityId = cityId || parseInt(this.citySelectDefaultItem);
                this.getDistrictsSelectList();
            })

    }

    getDistrictsSelectList(): void {
        if (!this.cityId) {
            return;
        }
        this._stateServiceServiceProxy
            .getDistrictSelectList(this.cityId)
            .subscribe(result => {
                this.districtSelectListData = result;
                if (result.length <= 0) {
                    this.isDistrictSelect = false;
                    this.districtSelectDefaultItem = "";
                    this.districtSelectListData.unshift(this.defaultItem);
                    this.districtSelectDefaultItem = this.districtSelectListData[0].value;
                    return;
                }
                this.districtSelectListData.unshift(this.defaultItem);
                this.districtSelectDefaultItem = this.districtSelectListData[1].value;
            })
    }

    public provinceSelectHandler(provinceId: any): void {
        this.provinceId = parseInt(provinceId);
        if (this.provinceId <= 0) {
            this.isCitySelect = false;
            this.isDistrictSelect = false;
            this.citySelectDefaultItem = this.defaultItem.value;
            this.districtSelectDefaultItem = this.defaultItem.value;
        } else {
            this.isCitySelect = true;
            this.isDistrictSelect = true;
            this.getCitysSelectList();
        }
    }
    public citySelectHandler(cityId: any): void {
        this.cityId = parseInt(cityId);
        this.getDistrictsSelectList();
    }

    public districtSelectHandler(districtId: any): void {
        this.districtId = parseInt(districtId);
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
