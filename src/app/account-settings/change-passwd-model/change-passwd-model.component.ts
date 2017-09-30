import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy, ChangePasswordInput } from '@shared/service-proxies/service-proxies';

export class RepeatPasswdDto extends ChangePasswordInput{
    repeatPasswd: string;
}

@Component({
    selector: 'xiaoyuyue-change-passwd-model',
    templateUrl: './change-passwd-model.component.html',
    styleUrls: ['./change-passwd-model.component.scss']
})
export class ChangePasswdModelComponent extends AppComponentBase implements OnInit {
    input: RepeatPasswdDto = new RepeatPasswdDto();

    @ViewChild('changePasswdModel') changePasswdModel: ModalDirective;
    constructor(
        private injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
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

}
