import { ChangePasswordByPhoneInput, ChangePasswordInput, CodeSendInput, ProfileServiceProxy, SMSServiceProxy } from '@shared/service-proxies/service-proxies';
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
    encryptPhoneNum: string;
    isSendSMS = false;
    input: RepeatPasswdDto = new RepeatPasswdDto();
    byPhoneInput: ChangePasswordByPhoneInput = new ChangePasswordByPhoneInput();
    phoneChangePasswd = false;
    oldPasswdChangePasswd = false;
    showCommandWrap = true;
    phoneNum: string;

    @ViewChild('smsBtn') _smsBtn: ElementRef;
    constructor(
        private injector: Injector,
        private _SMSServiceProxy: SMSServiceProxy,
        private _router: Router,
        private _profileServiceProxy: ProfileServiceProxy,
        private _appSessionService: AppSessionService
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
        const result = this.isBindingPhoneHandler();
        if (!result) {
            return;
        }
        this.showCommandWrap = false;
        this.oldPasswdChangePasswd = false;
        this.phoneChangePasswd = true;
    }

    // 发送验证码
    send() {
        const model = new CodeSendInput();
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
        const self = this;
        let time = 60;
        this.isSendSMS = true;
        const set = setInterval(() => {
            time--;
            self._smsBtn.nativeElement.innerHTML = `${time} 秒`;
        }, 1000)

        setTimeout(() => {
            clearInterval(set);
            self.isSendSMS = false;
            self._smsBtn.nativeElement.innerHTML = this.l('AgainSendValidateCode');
        }, 60000);
    }

    // getUserPhoneNum(): void {
    //     this._profileServiceProxy
    //         .getCurrentUserProfileForEdit()
    //         .subscribe(result => {
    //             this.phoneNum = result.phoneNumber;
    //             this.encrypt();
    //         })
    // }

    isBindingPhoneHandler(): boolean {
        if (this._appSessionService.user.phoneNumber != null) {
            this.phoneNum = this._appSessionService.user.phoneNumber;
            this.encrypt();
            return true;
        } else {
            this.message.confirm('您当前未绑定手机，绑定手机号才能更改密码', (result) => {
                if (result) {
                    this._router.navigate(['/settings/phone']);
                } else {
                    return false;
                }
            })
        }
    }

    private encrypt(): void {
        if (!this.phoneNum) {
            return;
        }
        this.encryptPhoneNum = '•••••••' + this.phoneNum.substr(this.phoneNum.length - 4);
    }
}
