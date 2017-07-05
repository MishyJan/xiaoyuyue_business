/**
 * 作用: 获取每个用户详细信息
 */
import { Injectable, Injector, OnInit } from '@angular/core';
import { GetUserForEditOutput, UserServiceProxy, ExternalUserLoginDto, UserEditDto, UserRoleDto, ProfileServiceProxy } from "shared/service-proxies/service-proxies";
import { AppServiceBase } from "shared/services/base.service";
import { AppConsts } from "shared/AppConsts";
import { AppGridData } from "shared/grid-data-results/grid-data-results";
import { GridDataResult } from "@progress/kendo-angular-grid/dist/es/data.collection";

@Injectable()
export class GetUserForEdit extends AppServiceBase implements OnInit {
    ngOnInit(): void {
    }

    getUserInfos: GetUserForEditOutput;
    externalLogins: ExternalUserLoginDto[];
    externalLoginData: AppGridData;
    user: UserEditDto = new UserEditDto();
    roles: UserRoleDto[];
    canChangeUserName: boolean = true;
    profilePicture: string = "/assets/common/images/default-profile-picture.png";

    constructor(
        injector: Injector,
        private _userServiceProxy: UserServiceProxy,
        private _externalLoginsDataResult: AppGridData,
        private _profileService: ProfileServiceProxy,

    ) {
        super(injector)
    }

    /**
     * 获取用户下的所有信息
     */
    getUserInfo(userId: number): void {
        // 用户ID为空表示正在创建用户，就不需去获取信息
        if (!userId) return;

        this.externalLoginData = this._externalLoginsDataResult;

        let loadExternalLoginData = () => {
            return this._userServiceProxy
                .getUserForEdit(userId)
                .map(response => {
                    this.getUserInfos = response;
                    this.externalLogins = response.externalLogins; 
                    this.user = response.user;
                    this.roles = response.roles;
                    this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
                    this.profilePicture = this.getProfilePicture(response.profilePictureId);

                    let gridData = (<GridDataResult>{
                        data: this.externalLogins,
                        total: this.externalLogins.length
                    });
                    return gridData;
                });
        };
        this._externalLoginsDataResult.query(loadExternalLoginData, true);
    }

    /**
     * 获取用户头像
     * @param 
     */
    getProfilePicture(profilePictureId: number): string {

        if (profilePictureId == null) {
            return this.profilePicture;
        }

        this._profileService.getProfilePictureById(profilePictureId).subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                return this.profilePicture;
            } else {
                return this.profilePicture;
            }
        });

    }
}