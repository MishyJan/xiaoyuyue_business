import { Component, Injector, OnInit, NgModule, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, CodeSendInput, SMSServiceProxy, TenantRegistrationServiceProxy, RegisterTenantInput } from '@shared/service-proxies/service-proxies'
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { RegisterModel } from './register.model';
import { LoginService } from "shared/services/login.service";
import { VerificationCodeType } from "shared/AppEnums";

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./resister.components.scss'],
    animations: [accountModuleAnimation()]
})
export class RegisterComponent extends AppComponentBase implements OnInit {
    phoneNumber: string;
    isSendSMS: boolean = false;
    confirmPasswd: string;

    model: RegisterTenantInput = new RegisterTenantInput();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();

    saving: boolean = false;

    @ViewChild('smsBtn') _smsBtn: ElementRef;
    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _tenantRegistrationServiceProxy: TenantRegistrationServiceProxy,
        private _router: Router,
        private readonly _loginService: LoginService,
        private _profileService: ProfileServiceProxy,
        private _SMSServiceProxy: SMSServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this.appSession.tenant == null) {
            this._router.navigate(['auth/login']);
            return;
        }

        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });

        // 注释螺丝帽
        /*jQuery.getScript('//captcha.luosimao.com/static/js/api.js', () => {
        });*/
    }

    // get useCaptcha(): boolean {
    //     return this.setting.getBoolean('App.UserManagement.UseCaptchaOnRegistration');
    // }

    register(): void {

        this.saving = true;
        this.model.phoneNumber = "18599926114";
        this.model.registerCode = "123";
        this._tenantRegistrationServiceProxy.registerTenant(this.model)
            .finally(() => { this.saving = false; })
            .subscribe((result) => {
                console.log(result);
                if (!result.isActive) {
                    this.notify.success(this.l('SuccessfullyRegistered'));
                    this._router.navigate(['auth/login']);
                    return;
                }

                //Autheticate
                this.saving = true;
                this._loginService.authenticateModel.loginCertificate = this.model.tenancyName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => { this.saving = false; });
            });
    }

    // 注释掉螺丝帽验证码
    // captchaResolved(): void {
    //     let captchaResponse = $('#lc-captcha-response').val();
    //     this.model.captchaResponse = captchaResponse;
    // }

    // 发送验证码
    send() {
        let input: CodeSendInput = new CodeSendInput();
        input.targetNumber = this.model.phoneNumber;
        input.codeType = VerificationCodeType.Register;
        input.captchaResponse = "";
        // input.captchaResponse = this.captchaResolved();

        this._SMSServiceProxy
            .sendCodeAsync(input)
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