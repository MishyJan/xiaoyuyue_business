import { Component, OnInit, Injector, Input } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";

@Component({
    selector: 'security-component',
    templateUrl: './security.component.html'
})
export class SecurityComponent extends AppComponentBase implements OnInit {
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
