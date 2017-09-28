import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { ChangePasswordInput, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';

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
    
    constructor(
        private injector: Injector,
        private _profileServiceProxy: ProfileServiceProxy
        
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    changePasswd(): void {
        this._profileServiceProxy
            .changePassword(this.input)
            .subscribe(result => {
                this.notify.success('密码修改成功');
            });
        this.input = new RepeatPasswdDto();
    }

}
