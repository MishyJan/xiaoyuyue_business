import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, ChangePasswordInput, ChangePasswordByPhoneInput, CodeSendInput, SMSServiceProxy } from '@shared/service-proxies/service-proxies';
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
    encryptPhoneNum: string;
    byPhoneInput: ChangePasswordByPhoneInput = new ChangePasswordByPhoneInput();
    phoneNum: string;
    codeType: number = VerificationCodeType.ChangePassword;

    @ViewChild('changePasswdModel') changePasswdModel: ModalDirective;
    constructor(
        private injector: Injector,
        private _SMSServiceProxy: SMSServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy,
        private _appSessionService: AppSessionService,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.phoneNum = this._appSessionService.user.phoneNumber;
        this.encrypt();
    }

    show(): void {
        this.changePasswdModel.show();
    }

    hide(): void {
        this.changePasswdModel.hide();
        this.input = new RepeatPasswdDto();
    }

    changePasswd(): void {
        this._profileServiceProxy
            .changePassword(this.input)
            .subscribe(result => {
                this.notify.success('密码修改成功');
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
        this._profileServiceProxy
            .changePasswordByPhone(this.byPhoneInput)
            .subscribe(result => {
                this.hide();
                this.notify.success('密码修改成功');
            });
        this.byPhoneInput = new ChangePasswordByPhoneInput();
    }

    private encrypt(): void {
        if (!this.phoneNum) {
            return;
        }
        this.encryptPhoneNum = '•••••••' + this.phoneNum.substr(this.phoneNum.length - 4);
    }
}
