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
    changePasswdMode: boolean = true;
    encryptPhoneNum: string;
    isSendSMS: boolean = false;
    byPhoneInput: ChangePasswordByPhoneInput = new ChangePasswordByPhoneInput();
    phoneNum: string;

    @ViewChild('changePasswdModel') changePasswdModel: ModalDirective;
    @ViewChild('smsBtn') _smsBtn: ElementRef;
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

    // 发送验证码
    send() {
        let model = new CodeSendInput();
        model.targetNumber = this.phoneNum;
        model.codeType = VerificationCodeType.ChangePassword;
        // this.captchaResolved();

        this._SMSServiceProxy
            .sendCodeAsync(model)
            .subscribe(result => {
                this.anginSend();
            });
    }

    anginSend() {
        let self = this;
        let time = 60;
        this.isSendSMS = true;
        let set = setInterval(() => {
            time--;
            self._smsBtn.nativeElement.innerHTML = `${time} 秒`;
        }, 1000)

        setTimeout(() => {
            clearInterval(set);
            self.isSendSMS = false;
            self._smsBtn.nativeElement.innerHTML = this.l("AgainSendValidateCode");
        }, 60000);
    }

    private encrypt(): void {
        if (!this.phoneNum) {
            return;
        }
        this.encryptPhoneNum = "•••••••" + this.phoneNum.substr(this.phoneNum.length - 4);
    }
}
