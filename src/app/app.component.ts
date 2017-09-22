import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AppConsts } from '@shared/AppConsts';
import { MobileSideBarComponent } from './shared/layout/mobile-side-bar/mobile-side-bar.component';
import { SidebarService } from 'shared/services/side-bar.service';

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    toggleSidebarFlag: boolean = false;
    sidebarListShow: number;

    private viewContainerRef: ViewContainerRef;

    @ViewChild('mobileSideBarModel') mobileSideBarModel: MobileSideBarComponent;

    public constructor(
        viewContainerRef: ViewContainerRef,
        private _sidebarService: SidebarService
    ) {
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
        this._sidebarService
        .toggleSidebarFlag.subscribe( flag => {
            this.toggleSidebarFlag = flag;
        })
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        App.init();
        App.initComponents();
        Layout.init();

        this.sidebarIsShow();
    }

    /**
     * 如果菜单栏为空就不显示，并且把page-content宽度设置为100%
     */
    sidebarIsShow() {
        this.sidebarListShow = $('#sidebar .page-sidebar-menu').children().length;
        if (this.sidebarListShow < 1) {
            $('#sidebar').children().eq(0).css({
                width: 0
            })

            $('.page-content-wrapper .page-content').css({
                width: '100%',
                left: 0,
                paddingLeft: '20px',
                marginLeft: 0
            })
        }
    }
}

