import { ChangePasswordByPhoneInput, ChangePasswordInput, CodeSendInput, ProfileServiceProxy, SMSServiceProxy, PasswordComplexitySetting } from '@shared/service-proxies/service-proxies';
import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { Router } from '@angular/router';
import { VerificationCodeType } from 'shared/AppEnums';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

export class RepeatPasswdDto extends ChangePasswordInput {
    repeatPasswd: string;
}

@Component({
    selector: 'xiaoyuyue-passwd',
    templateUrl: './passwd.component.html',
    styleUrls: ['./passwd.component.scss'],
    animations: [accountModuleAnimation()]
})
export class PasswdComponent extends AppComponentBase implements OnInit {
    input: RepeatPasswdDto = new RepeatPasswdDto();
    byPhoneInput: ChangePasswordByPhoneInput = new ChangePasswordByPhoneInput();
    phoneChangePasswd = false;
    oldPasswdChangePasswd = false;
    showCommandWrap = true;
    phoneNum: string;
    codeType = VerificationCodeType.ChangePassword;
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    @ViewChild('smsBtn') _smsBtn: ElementRef;
    constructor(
        private injector: Injector,
        private _SMSServiceProxy: SMSServiceProxy,
        private _router: Router,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService
    ) {
        super(injector);
    }

    ngOnInit() {
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
    }
    // 使用旧密码更改密码
    oldPasswdChangeHandler(): void {
        this._profileService
            .changePassword(this.input)
            .subscribe(result => {
                this.notify.success(this.l('ChangePasswdSuccessed'));
                this.showCommandWrap = true;
            });
        this.input = new RepeatPasswdDto();
    }

    // 使用手机验证更改密码
    phoneChangeHandler(): void {
        this._profileService
            .changePasswordByPhone(this.byPhoneInput)
            .subscribe(result => {
                this.notify.success(this.l('ChangePasswdSuccessed'));
                this.showCommandWrap = true;
                this.phoneChangePasswd = false;
                this.oldPasswdChangePasswd = false;

            });
        this.byPhoneInput = new ChangePasswordByPhoneInput();
    }

    showUseOldPasswdEle(): void {
        this.showCommandWrap = false;
        this.oldPasswdChangePasswd = true;
        this.phoneChangePasswd = false;
    }
    usePhoneChangeEle(): void {
        const result = this.isBindingPhoneHandler();
        if (!result) {
            return;
        }
        this.showCommandWrap = false;
        this.oldPasswdChangePasswd = false;
        this.phoneChangePasswd = true;
    }

    isBindingPhoneHandler(): boolean {
        if (this._appSessionService.user.phoneNumber != null) {
            this.phoneNum = this._appSessionService.user.phoneNumber;
            return true;
        } else {
            this.message.confirm(this.l('Security.ChangePasswd.MustBingPhone'), (result) => {
                if (result) {
                    this._router.navigate(['/settings/phone']);
                } else {
                    return false;
                }
            })
        }
    }
}
