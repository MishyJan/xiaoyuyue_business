import { Component, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';

@Component({
    templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit, AfterViewInit {

    public constructor(
    ) {
    }

    ngOnInit(): void {
        // SignalRHelper.initSignalR(() => { this._chatSignalrService.init(); });
    }

    ngAfterViewInit(): void {
    }
}

