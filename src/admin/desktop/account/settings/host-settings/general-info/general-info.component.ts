import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { AppTimezoneScope } from "shared/AppEnums";

@Component({
    selector: 'general-info',
    templateUrl: './general-info.component.html'
})
export class GeneralInfoComponent extends AppComponentBase implements OnInit {
    @Input()
    hostSettings: object;

    defaultTimezoneScope: AppTimezoneScope = AppTimezoneScope.Application;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

}
