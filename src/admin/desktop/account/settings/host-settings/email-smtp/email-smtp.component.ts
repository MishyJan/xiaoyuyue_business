import { Component, OnInit, Injector, ViewEncapsulation, ViewChild, Input, Output } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { SendTestEmailInput, HostSettingsServiceProxy } from "shared/service-proxies/service-proxies";
import { HostSettingService } from "shared/services/get-host-settings.service";

@Component({
    selector: 'email-smtp',
    templateUrl: './email-smtp.component.html'
})
export class EmailSmtpComponent extends AppComponentBase implements OnInit {
    @Input()
    hostSettings: object;

    testEmailAddress: string = undefined;

    constructor(
        injector: Injector,
        private _hostSettingService: HostSettingService
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }
}
