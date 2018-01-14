import { Component, AfterViewInit, Input, ElementRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { ListScrollService } from 'shared/services/list-scroll.service';

@Component({
    selector: 'xiaoyuyue-list-scroll',
    templateUrl: './list-scroll.component.html',
    styleUrls: ['./list-scroll.component.scss']
})
export class ListScrollComponent implements OnInit, AfterViewInit {
    bscroll: BScroll;
    @ViewChild('bscrollEl') bscrollEl: ElementRef;
    @Input() height: string;
    @Output() finishPullDown: EventEmitter<boolean> = new EventEmitter();
    @Output() finishPullUp: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private _listScrollService: ListScrollService
    ) {
        this._listScrollService
            .pullDownFinished
            .subscribe(result => {
                if (result) {
                    this.bscroll.finishPullDown();
                }
            })
        this._listScrollService
            .pullUpFinished
            .subscribe(result => {
                if (result) {
                    console.log('yes');
                    this.bscroll.finishPullUp();
                }
            })
    }

    ngOnInit() {
        if (!this.height) { this.height = '100vh'; }
    }

    ngAfterViewInit() {
        this.bscrollEl.nativeElement.style.height = this.height;
        this.bscroll = new BScroll(this.bscrollEl.nativeElement, {
            click: true,
            pullUpLoad: true,
            pullDownRefresh: true
        });

        this.bscroll.on('pullingDown', () => {
            console.log('upupup');
            this.finishPullDown.emit(true);
            console.log('end');
        })

        this.bscroll.on('pullingUp', () => {
            console.log('down');
            this.finishPullUp.emit(true);
            this.bscroll.refresh();
            console.log('end');
        })
    }
}
