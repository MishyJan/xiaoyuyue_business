import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AbpSessionService } from '@abp/session/abp-session.service';

@Component({
    selector: "xiaoyuyue-background-img",
    templateUrl: './background-img.component.html',
    styleUrls: ['background-img.component.scss'],
    animations: [accountModuleAnimation()]
})

export class BackgroundImgComponent extends AppComponentBase {

    @ViewChild('loginBg') _loginBg: ElementRef;
    private $loginBg: JQuery;

    private imageData: string[] = [
        "/assets/common/images/login/bg.jpg",
    ]
    private imgUrl: string;

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // this.imgUrl = `url(${this.imageData[0]}`;
        this.$loginBg = $(this._loginBg.nativeElement);
        $(this.$loginBg).backstretch(this.imageData, { duration: 5000, fade: 500 });
    }
}
