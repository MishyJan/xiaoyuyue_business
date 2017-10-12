import { Component, OnInit, Injector, Input, SimpleChanges, ElementRef, NgZone, Output, EventEmitter, ViewChild } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';
import { SelectListItemDto, StateServiceServiceProxy, OutletEditDto } from 'shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { SelectHelper } from 'shared/helpers/SelectHelper';

declare const qq: any;

@Component({
    selector: 'xiaoyuyue-outlet-address',
    templateUrl: './outlet-address.component.html',
    styleUrls: ['./outlet-address.component.scss']
})
export class OutletAddressComponent extends AppComponentBase implements OnInit {
    zoom: number = 12;
    position: any;
    lng: string = '116.397572';
    lat: string = '39.908815';
    status: string;
    marker: any;
    map: any;

    detailAddress: string;
    outletId: number;
    selectedDistrictId: string;
    selectedCityId: string;
    selectedProvinceId: string;

    districtId: number;
    cityId: number;
    provinceId: number;

    isCitySelect = false;
    isDistrictSelect = false;

    provinceSelectListData: SelectListItemDto[] = [];
    citysSelectListData: SelectListItemDto[] = [];
    districtSelectListData: SelectListItemDto[] = [];

    outletInfo: OutletEditDto = new OutletEditDto();

    @Input() outletForEdit: OutletEditDto = new OutletEditDto();
    @Output() getOutletInfoHandler: EventEmitter<OutletEditDto> = new EventEmitter();
    @ViewChild('searchWrap') searchWrap: ElementRef;
    constructor(
        private injector: Injector,
        private _stateServiceServiceProxy: StateServiceServiceProxy,
        private _route: ActivatedRoute,
        private el: ElementRef,
        private zone: NgZone
    ) {
        super(injector);
        this.outletId = +this._route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.provinceSelectListData.unshift(SelectHelper.ProvinceSelectList());
        this.selectedProvinceId = this.provinceSelectListData[0].value;
        if (!this.outletId) {
            this.mapsReady();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.outletForEdit.currentValue.availableProvinces) {

            this.provinceSelectListData = changes.outletForEdit.currentValue.availableProvinces;
            this.selectedProvinceId = changes.outletForEdit.currentValue.outlet.provinceId + '';
            this.provinceId = changes.outletForEdit.currentValue.outlet.provinceId;

            this.citysSelectListData = changes.outletForEdit.currentValue.availableCitys;
            this.selectedCityId = changes.outletForEdit.currentValue.outlet.cityId + '';
            this.cityId = changes.outletForEdit.currentValue.outlet.cityId;

            this.districtSelectListData = changes.outletForEdit.currentValue.availableDistricts;
            this.selectedDistrictId = changes.outletForEdit.currentValue.outlet.districtId + '';
            this.districtId = changes.outletForEdit.currentValue.outlet.districtId;

            this.detailAddress = changes.outletForEdit.currentValue.outlet.detailAddress;
            let longitude = changes.outletForEdit.currentValue.outlet.longitude;
            if (longitude !== null) {
                let temp = longitude.split(',');
                this.lat = temp[0];
                this.lng = temp[1];
            }

            this.mapsReady();

            if (changes.outletForEdit.currentValue.outlet.provinceId >= 0) {
                this.isCitySelect = true;
                this.isDistrictSelect = true;
            }
        }
    }

    getProvinceSelectList(provinceId?: number): void {
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
                this.codeAddress();
            })
    }

    /* 腾讯地图相关代码 */
    mapsReady(): void {
        this.initOptions();
    }

    // 用户详细地址来获取经纬度
    codeAddress() {
        let geocoder = new qq.maps.Geocoder();
        let address = this.transformAddress() + this.detailAddress;

        if (address === undefined) {
            return;
        }

        //对指定地址进行解析
        geocoder.getLocation(address);
        //设置服务请求成功的回调函数
        geocoder.setComplete((result) => {
            this.lat = result.detail.location.lat;
            this.lng = result.detail.location.lng;
            this.outletInfo.longitude = this.lat + ',' + this.lng;
            this.outletInfo.detailAddress = this.detailAddress;
            this.getOutletInfoHandler.emit(this.outletInfo);
            this.zoom = 16;
            this.initOptions();
        });
        //若服务请求失败，则运行以下函数
        geocoder.setError(() => {
            this.notify.warn("地址未找到");
        });
    }

    private initOptions(): void {
        let position = new qq.maps.LatLng(this.lat, this.lng);
        this.map = new qq.maps.Map('mapContainer', {
            center: position,
            zoom: this.zoom,
            mapTypeControl: false,
            panControl: false,
            zoomControl: false,
            scaleControl: false
        });

        this.marker = new qq.maps.Marker({
            position: position,
            map: this.map
        });
        //设置Marker的可见性，为true时可见,false时不可见，默认属性为true
        this.marker.setVisible(true);
        //设置Marker的动画属性为从落下
        this.marker.setAnimation(qq.maps.MarkerAnimation.DOWN);
        //设置Marker是否可以被拖拽，为true时可拖拽，false时不可拖拽，默认属性为false
        this.marker.setDraggable(true);

        qq.maps.event.addListener(this.marker, 'dragend', (event: any) => {
            this.lat = event.latLng.lat;
            this.lng = event.latLng.lng;
            this.outletInfo.longitude = this.lat + ',' + this.lng;
            this.getOutletInfoHandler.emit(this.outletInfo);
        });
    }

    // 遍历省/市/区的数组中，拿到具体详细地址
    private transformAddress(): string {
        let addressText = '';
        this.provinceSelectListData.forEach(province => {
            if (province.value === this.selectedProvinceId) {
                addressText += province.text + ',';
            }
        });

        this.citysSelectListData.forEach(citys => {
            if (citys.value === this.selectedCityId) {
                addressText += citys.text + ',';
            }
        });

        this.districtSelectListData.forEach(district => {
            if (district.value === this.selectedDistrictId) {
                addressText += district.text + ',';
            }
        });

        return addressText;
    }

    public provinceSelectHandler(provinceId: any): void {
        debugger
        this.outletInfo.provinceId = this.provinceId = parseInt(provinceId, null);
        this.selectedProvinceId = provinceId;
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
        this.outletInfo.provinceId = this.cityId = parseInt(cityId, null);
        this.selectedCityId = cityId;
        this.getDistrictsSelectList(cityId);
        this.codeAddress();
    }

    public districtSelectHandler(districtId: any): void {
        this.outletInfo.districtId = this.selectedDistrictId = districtId;
        this.districtId = parseInt(districtId, null);
        this.codeAddress();
    }

    public openProvinceSledct(): void {
        this.getProvinceSelectList();
    }
}