import { Component, AfterViewInit, Input, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
    selector: 'xiaoyuyue-list-scroll',
    templateUrl: './list-scroll.component.html',
    styleUrls: ['./list-scroll.component.scss']
})
export class ListScrollComponent implements OnInit, AfterViewInit {
    @ViewChild('bscroll') bscroll: ElementRef;
    @Input() height: string;

    constructor() { }

    ngOnInit() {
        if (!this.height) { this.height = '100vh'; }
    }

    ngAfterViewInit() {
        this.bscroll.nativeElement.style.height = this.height;
        const bscroll = new BScroll(this.bscroll.nativeElement, {
            click: true
        });
    }
}
