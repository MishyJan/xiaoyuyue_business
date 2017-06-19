import { Component, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
// import { SignalRHelper } from 'shared/helpers/SignalRHelper';

@Component({
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
    sidebarListShow: number;

    private viewContainerRef: ViewContainerRef;

    public constructor(
        viewContainerRef: ViewContainerRef,
    ) {
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
    }

    ngOnInit(): void {
        // SignalRHelper.initSignalR(() => { this._chatSignalrService.init(); });
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
        this.sidebarListShow = $("#sidebar .page-sidebar-menu").children().length;
        if (this.sidebarListShow < 1) {
            $("#sidebar").children().eq(0).css({
                width: 0
            })

            $(".page-content-wrapper .page-content").css({
                width: "100%",
                left: 0,
                paddingLeft: "20px",
                marginLeft: 0
            })
        }
    }
}

