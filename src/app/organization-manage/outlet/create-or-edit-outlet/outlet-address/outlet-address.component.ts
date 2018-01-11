import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GetOutletForEditDto, OutletEditDto, SelectListItemDto, StateServiceServiceProxy } from 'shared/service-proxies/service-proxies';

import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from 'shared/common/app-component-base';
import { LocalStorageService } from 'shared/utils/local-storage.service';
import { AppConsts } from 'shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { SelectHelperService } from 'shared/services/select-helper.service';

declare const qq: any;

@Component({
    selector: 'xiaoyuyue-outlet-address',
    templateUrl: './outlet-address.component.html',
    styleUrls: ['./outlet-address.component.scss']
})
export class OutletAddressComponent extends AppComponentBase implements OnInit, OnChanges, AfterViewInit {
    zoom = 12;
    position: any;
    lng = '116.397572';
    lat = '39.908815';
    status: string;
    marker: any;
    map: any;

    outletId: number;
    selectedDistrictId: string;
    selectedCityId: string;
    selectedProvinceId: string;

    provinceSelectListData: SelectListItemDto[] = [];
    citysSelectListData: SelectListItemDto[] = [];
    districtSelectListData: SelectListItemDto[] = [];

    @Input() outletInfo: OutletEditDto = new OutletEditDto();
    @Output() getOutletInfoHandler: EventEmitter<OutletEditDto> = new EventEmitter();
    @ViewChild('searchWrap') searchWrap: ElementRef;
    constructor(
        private injector: Injector,
        private _selectHelper: SelectHelperService,
        private _stateServiceServiceProxy: StateServiceServiceProxy,
        private _localStorageService: LocalStorageService,
        private _sessionService: AppSessionService,
        private _route: ActivatedRoute,
        private el: ElementRef,
        private zone: NgZone
    ) {
        super(injector);
        this.outletId = +this._route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        // this.getQQMapScript();
        // this.provinceSelectListData.unshift(this._selectHelper.provinceSelectList());
        // this.selectedProvinceId = this.provinceSelectListData[0].value;
    }

    ngAfterViewInit() {
        if (!this.outletId) {
            this.mapsReady();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.outletInfo.firstChange) {
            this.initSelectListData();
            return
        };
        this.outletInfo.provinceId = changes.outletInfo.currentValue.provinceId;
        this.selectedProvinceId = this.outletInfo.provinceId + '';
        this.getProvinceSelectList();

        this.outletInfo.cityId = changes.outletInfo.currentValue.cityId;
        this.selectedCityId = this.outletInfo.cityId + '';
        this.getCitysSelectList(this.outletInfo.provinceId);

        this.outletInfo.districtId = changes.outletInfo.currentValue.districtId;
        this.selectedDistrictId = this.outletInfo.districtId + '';
        this.getDistrictsSelectList(this.outletInfo.cityId);

        this.outletInfo.detailAddress = changes.outletInfo.currentValue.detailAddress;
        // 如果数据恢复时，没有省/市的下拉数据，则初始下拉数据
        if (!this.outletInfo.provinceId) { this.initSelectListData(); }
        const longitude = changes.outletInfo.currentValue.longitude;
        if (longitude) {
            const temp = longitude.split(',');
            this.lat = temp[0];
            this.lng = temp[1];
        }

        this.mapsReady();
    }

    // 在创建状态下，下拉数据源为索引值为0的值，比如：北京，北京，东城区
    initSelectListData(): void {
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.provinceSelectListCache), () => {
            return this._stateServiceServiceProxy.getProvinceSelectList()
        }).then(provinceSelectListResult => {
            this.provinceSelectListData = provinceSelectListResult;
            this.selectedProvinceId = provinceSelectListResult[0].value;
            this._localStorageService.getItem(abp.utils.formatString(AppConsts.citysSelectListCache, provinceSelectListResult[0].value), () => {
                return this._stateServiceServiceProxy.getCitySelectList(+this.selectedProvinceId)
            }).then(citysSelectListResult => {
                this.citysSelectListData = citysSelectListResult;
                this.selectedCityId = citysSelectListResult[0].value;
                this._localStorageService.getItem(abp.utils.formatString(AppConsts.districtsSelectListCache, citysSelectListResult[0].value), () => {
                    return this._stateServiceServiceProxy.getDistrictSelectList(+this.selectedCityId)
                }).then(districtsSelectListResult => {
                    this.districtSelectListData = districtsSelectListResult;
                    this.selectedDistrictId = districtsSelectListResult[0].value;
                });
            });
        });
    }

    getProvinceSelectList(): void {
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.provinceSelectListCache), () => {
            return this._stateServiceServiceProxy.getProvinceSelectList()
        }).then(result => {
            this.provinceSelectListData = result;
            this.outletInfo.provinceId = parseInt(this.selectedProvinceId, null);
        });
    }

    getCitysSelectList(provinceId: number): void {
        if (!provinceId) {
            return;
        }
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.citysSelectListCache, provinceId), () => {
            return this._stateServiceServiceProxy.getCitySelectList(provinceId)
        }).then(result => {
            this.citysSelectListData = result;
            this.selectedCityId = this.citysSelectListData[0].value;
            this.outletInfo.cityId = parseInt(this.selectedCityId, null);
            this.getDistrictsSelectList(this.outletInfo.cityId);
            this.outletInfo.cityId = this.outletInfo.cityId;
            this.getOutletInfoHandler.emit(this.outletInfo);
        });
    }

    getDistrictsSelectList(cityId: number): void {
        if (!cityId) {
            return;
        }
        this._localStorageService.getItem(abp.utils.formatString(AppConsts.districtsSelectListCache, cityId), () => {
            return this._stateServiceServiceProxy.getDistrictSelectList(cityId)
        }).then(result => {
            this.districtSelectListData = result;
            if (result.length <= 0) {
                this.selectedDistrictId = '';
                this.outletInfo.districtId = 0;
            } else {
                this.selectedDistrictId = this.districtSelectListData[0].value;
                this.outletInfo.districtId = parseInt(this.selectedDistrictId, null);
            }
            this.codeAddress();
            this.outletInfo.districtId = this.outletInfo.districtId;
            this.getOutletInfoHandler.emit(this.outletInfo);
        });
    }

    /* 腾讯地图相关代码 */
    mapsReady(): void {
        this.initOptions();
    }

    // 用户详细地址来获取经纬度
    codeAddress() {
        const geocoder = new qq.maps.Geocoder();
        const address = this.transformAddress() + this.outletInfo.detailAddress;

        if (address === undefined) {
            return;
        }

        // 对指定地址进行解析
        geocoder.getLocation(address);
        // 设置服务请求成功的回调函数
        geocoder.setComplete((result) => {
            this.lat = result.detail.location.lat;
            this.lng = result.detail.location.lng;
            this.outletInfo.longitude = this.lat + ',' + this.lng;
            this.outletInfo.detailAddress = this.outletInfo.detailAddress;
            this.getOutletInfoHandler.emit(this.outletInfo);
            this.zoom = 16;
            this.initOptions();
        });
        // 若服务请求失败，则运行以下函数
        geocoder.setError(() => {
            this.notify.warn(this.l('Address.NotFound'));
        });
    }

    private initOptions(): void {
        const position = new qq.maps.LatLng(this.lat, this.lng);
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
        // 设置Marker的可见性，为true时可见,false时不可见，默认属性为true
        this.marker.setVisible(true);
        // 设置Marker的动画属性为从落下
        this.marker.setAnimation(qq.maps.MarkerAnimation.DOWN);
        // 设置Marker是否可以被拖拽，为true时可拖拽，false时不可拖拽，默认属性为false
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
        this.outletInfo.provinceId = this.outletInfo.provinceId = parseInt(provinceId, null);
        this.selectedProvinceId = provinceId;
            this.getCitysSelectList(provinceId);
            this.getOutletInfoHandler.emit(this.outletInfo);
    }
    public citySelectHandler(cityId: any): void {
        this.outletInfo.cityId = this.outletInfo.cityId = parseInt(cityId, null);
        this.selectedCityId = cityId;
        this.getDistrictsSelectList(cityId);
        this.codeAddress();
        this.getOutletInfoHandler.emit(this.outletInfo);
    }

    public districtSelectHandler(districtId: any): void {
        this.outletInfo.districtId = this.selectedDistrictId = districtId;
        this.outletInfo.districtId = parseInt(districtId, null);
        this.codeAddress();
        this.getOutletInfoHandler.emit(this.outletInfo);
    }

    public openProvinceSledct(): void {
        this.getProvinceSelectList();
    }

    getQQMapScript() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://map.qq.com/api/js?v=2.exp&key=3ZBBZ-S4OWQ-N4U5Y-GYQRZ-FKASV-TOFLQ';
        document.body.appendChild(script);
    }
}
