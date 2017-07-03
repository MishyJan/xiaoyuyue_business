import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { StateServiceServiceProxy, SelectListItemDto } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'xiaoyuyue-create-or-edit-outlet',
  templateUrl: './create-or-edit-outlet.component.html',
  styleUrls: ['./create-or-edit-outlet.component.scss'],
  animations: [accountModuleAnimation()],
})
export class CreateOrEditOutletComponent extends AppComponentBase implements OnInit {
  districtSelectDefaultItem: string;
  citySelectDefaultItem: string;
  provinceSelectDefaultItem: string;
  defaultItem: SelectListItemDto = new SelectListItemDto();
  cityId: number = 1;
  provinceId: number = 1;
  isCitySelect: boolean = false;
  isDistrictSelect: boolean = false;
  provinceSelectListData: SelectListItemDto[];
  citysSelectListData: SelectListItemDto[];
  districtSelectListData: SelectListItemDto[];
  constructor(
    injector: Injector,
    private _stateServiceServiceProxy: StateServiceServiceProxy
  ) {
    super(
      injector
    );
  }

  ngOnInit() {
    this.defaultItem.text = "请选择";
    this.defaultItem.value = "0";
    this.getProvinceSelectList();
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

}
