import { Component, Injector, OnInit, NgModule, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, SMSServiceProxy, TenantRegistrationServiceProxy, RegisterTenantInput } from '@shared/service-proxies/service-proxies'
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { RegisterModel } from './register.model';
import { LoginService } from "shared/services/login.service";
import { VerificationCodeType, SendCodeType } from "shared/AppEnums";
import { ProtocolModelComponent } from './protocol-model/protocol-model.component';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./resister.components.scss'],
    animations: [accountModuleAnimation()]
})
export class RegisterComponent extends AppComponentBase implements OnInit {
    phoneRegister: boolean = true;
    protocolText: string;
    phoneNumber: string;
    confirmPasswd: string;
    codeType = VerificationCodeType.Register;
    model: RegisterTenantInput = new RegisterTenantInput();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving: boolean = false;
    emailAddress: string;
    sendCodeType: SendCodeType = SendCodeType.Email;

    @ViewChild('protocolModal') protocolModal: ProtocolModelComponent;

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
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });

        // 注释螺丝帽
        // jQuery.getScript('//captcha.luosimao.com/static/js/api.js', () => {
        // });
    }

    // get useCaptcha(): boolean {
    //     return this.setting.getBoolean('App.UserManagement.UseCaptchaOnRegistration');
    // }

    readProtocolModal(): void {
        this.protocolModal.show();
    }

    register(): void {
        this.saving = true;
        this._tenantRegistrationServiceProxy.registerTenant(this.model)
            .finally(() => { this.saving = false; })
            .subscribe((result) => {
                if (!result.isActive) {
                    this.notify.success(this.l('SuccessfullyRegistered'));
                    this._router.navigate(['auth/login']);
                    return;
                }

                this.saving = true;
                this._loginService.authenticateModel.loginCertificate = this.model.tenancyName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => { this.saving = false; });
            });
    }

        // 是否手机号注册
        isPhoneRegister() {
            this.phoneRegister = true;
            this.model.emailAddress = '';
            this.model.type = 1;
        }
        // 是否邮件注册
        isEmailRegister() {
            this.phoneRegister = false;
            this.model.phoneNumber = '';
            this.model.type = 2;
        }

    // 注释掉螺丝帽验证码
    // captchaResolved(): void {
    //     let captchaResponse = $('#lc-captcha-response').val();
    //     this.model.captchaResponse = captchaResponse;
    // }
}
