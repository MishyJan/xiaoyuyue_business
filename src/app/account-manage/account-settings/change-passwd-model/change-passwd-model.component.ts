import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, ChangePasswordInput, ChangePasswordByPhoneInput, CodeSendInput, SMSServiceProxy, PasswordComplexitySetting } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { VerificationCodeType } from 'shared/AppEnums';
import { AppSessionService } from '@shared/common/session/app-session.service';

export class RepeatPasswdDto extends ChangePasswordInput {
    repeatPasswd: string;
}

@Component({
    selector: 'xiaoyuyue-change-passwd-model',
    templateUrl: './change-passwd-model.component.html',
    styleUrls: ['./change-passwd-model.component.scss'],
    animations: [accountModuleAnimation()]
})
export class ChangePasswdModelComponent extends AppComponentBase implements OnInit {
    input: RepeatPasswdDto = new RepeatPasswdDto();
    changePasswdMode = true;
    byPhoneInput: ChangePasswordByPhoneInput = new ChangePasswordByPhoneInput();
    phoneNum: string;
    codeType: number = VerificationCodeType.ChangePassword;
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    @ViewChild('changePasswdModel') changePasswdModel: ModalDirective;
    constructor(
        private injector: Injector,
        private _SMSServiceProxy: SMSServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _appSessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });
        this.phoneNum = this._appSessionService.user.phoneNumber;
    }

    show(): void {
        this.changePasswdModel.show();
    }

    hide(): void {
        this.changePasswdModel.hide();
        this.input = new RepeatPasswdDto();
    }

    changePasswd(): void {
        this._profileService
            .changePassword(this.input)
            .subscribe(result => {
                this.notify.success(this.l('ChangePassword.Success.Hint'));
                this.hide();
            });
        this.input = new RepeatPasswdDto();
    }

    changePasswdModeHandler(modeFlag: boolean): void {
        if (!this.phoneNum) {
            this.message.warn(this.l('NotBindingPhone.Hint'));
            this.hide();
            return;
        }
        this.changePasswdMode = modeFlag;
    }

    // 使用手机验证更改密码
    phoneChangeHandler(): void {
        this._profileService
            .changePasswordByPhone(this.byPhoneInput)
            .subscribe(result => {
                this.hide();
                this.notify.success(this.l('ChangePassword.Success.Hint'));
            });
        this.byPhoneInput = new ChangePasswordByPhoneInput();
    }
}
