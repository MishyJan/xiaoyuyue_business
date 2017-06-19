import { Component, OnInit, Injector, ViewEncapsulation, ViewChild, Input, Output } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";

@Component({
    selector: 'user-management',
    templateUrl: './user-management.component.html'
})
export class UserManagementComponent extends AppComponentBase implements OnInit {
    @Input()
    hostSettings: object;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

}
