import { Component, OnInit, Injector, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { ChangePasswordInput, ProfileServiceProxy, ChangePasswordByPhoneInput, SMSServiceProxy, CodeSendInput } from '@shared/service-proxies/service-proxies';
import { VerificationCodeType } from 'shared/AppEnums';

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
    isSendSMS: boolean = false;
    input: RepeatPasswdDto = new RepeatPasswdDto();
    byPhoneInput: ChangePasswordByPhoneInput = new ChangePasswordByPhoneInput();
    phoneChangePasswd: boolean = false;
    oldPasswdChangePasswd: boolean = false;
    showCommandWrap: boolean = true;
    phoneNum: string;

    @ViewChild('smsBtn') _smsBtn: ElementRef;
    constructor(
        private injector: Injector,
        private _SMSServiceProxy: SMSServiceProxy,
        private _profileServiceProxy: ProfileServiceProxy

    ) {
        super(injector);
    }

    ngOnInit() {
    }
    // 使用旧密码更改密码
    oldPasswdChangeHandler(): void {
        this._profileServiceProxy
            .changePassword(this.input)
            .subscribe(result => {
                this.notify.success('密码修改成功');
                this.showCommandWrap = true;
            });
        this.input = new RepeatPasswdDto();
    }

    // 使用手机验证更改密码
    phoneChangeHandler(): void {
        this._profileServiceProxy
            .changePasswordByPhone(this.byPhoneInput)
            .subscribe(result => {
                this.notify.success('密码修改成功');
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
        this.showCommandWrap = false;
        this.oldPasswdChangePasswd = false;
        this.phoneChangePasswd = true;
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
}
