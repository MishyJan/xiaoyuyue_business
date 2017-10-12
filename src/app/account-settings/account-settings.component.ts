import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ExternalUnBindingModel, TokenAuthServiceProxy, UserCodeSendInput } from './../../shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BindingPhoneModelComponent } from './phone-model/binding-phone-model/binding-phone-model.component';
import { ChangePasswdModelComponent } from './change-passwd-model/change-passwd-model.component';
import { ExternalBindingModelComponent } from './external-auth/external-binding-model/external-binding-model.component';
import { UnbindingPhoneModelComponent } from './phone-model/unbinding-phone-model/unbinding-phone-model.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-acount-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountSecurityComponent extends AppComponentBase implements OnInit {
    @ViewChild('changePasswdModel') changePasswdModel: ChangePasswdModelComponent;
    @ViewChild('bindingPhoneModel') bindingPhoneModel: BindingPhoneModelComponent;
    @ViewChild('unbindingPhoneModel') unbindingPhoneModel: UnbindingPhoneModelComponent;
    @ViewChild('externalBindingModel') externalBindingModel: ExternalBindingModelComponent;

    unBinding = false;
    wechatName: string;
    constructor(
        private injector: Injector,
        private _appSessionService: AppSessionService,
        private _tokenAuthService: TokenAuthServiceProxy
    ) {
        super(
            injector
        );


    }

    ngOnInit() {
        this.wechatName = this._appSessionService.user.weChat;
    }

    // 是否已绑定手机
    isBindingPhone(): boolean {
        return this._appSessionService.user.phoneNumber ? true : false;
    }

    // 是否已绑定微信
    isBindingWeChat(): boolean {
        return this._appSessionService.user.weChat ? true : false;
    }

    bindWeChat() {
        this.externalBindingModel.show('WeChat');
    }

    bindWeChatResult(result) {
        if (result) { this.wechatName = this._appSessionService.user.weChat; }
    }

    // 解绑微信
    unBindWeChat() {
        this.unBinding = true;
        const data = new ExternalUnBindingModel();
        data.authProvider = 'WeChat'
        this._tokenAuthService.externalUnBinding(data).subscribe(result => {
            this.notify.success('解绑成功');
            this._appSessionService.init();
        });
    }

    showChangePasswdModel(): void {
        this.changePasswdModel.show();
    }

    showChangePhoneModel(): void {
        this.unbindingPhoneModel.show();
    }

    showBindingPhoneModel(): void {
        this.bindingPhoneModel.show();
    }
}
