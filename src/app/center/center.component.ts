import { Component, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';

@Component({
    templateUrl: './center.component.html'
})
export class CenterComponent implements OnInit, AfterViewInit {

    public constructor(
    ) {
    }

    ngOnInit(): void {
        // SignalRHelper.initSignalR(() => { this._chatSignalrService.init(); });
    }

    ngAfterViewInit(): void {
    }
}

