import { Component, AfterViewInit, Input, ElementRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { ListScrollService } from 'shared/services/list-scroll.service';
import { ScrollStatusOutput } from 'app/shared/utils/list-scroll.dto';

@Component({
    selector: 'xiaoyuyue-list-scroll',
    templateUrl: './list-scroll.component.html',
    styleUrls: ['./list-scroll.component.scss']
})
export class ListScrollComponent implements OnInit, AfterViewInit {
    isPullingUp: boolean;
    bscroll: BScroll;
    scrollStatusOutput: ScrollStatusOutput = new ScrollStatusOutput();
    @ViewChild('bscrollEl') bscrollEl: ElementRef;
    @ViewChild('bscrollContentEl') bscrollContentEl: ElementRef;
    @Input() height = '100vh';
    @Input() isNeedPullUpLoad = false;
    @Input() isNeedPullDownRefresh = false;
    @Output() finishPullDownHandle: EventEmitter<boolean> = new EventEmitter();
    @Output() finishPullUpHandle: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private _listScrollService: ListScrollService
    ) {
        this._listScrollService
            .listScrollFinished
            .subscribe((result: ScrollStatusOutput) => {
                this.scrollStatusOutput = result;
                if (result.pulledUpActive !== null && !result.pulledUpActive) {
                    this.refresh();
                    // this.bscroll.finishPullUp();
                }
                if (result.pulledDownActive !== null && !result.pulledDownActive) {
                    this.finishPullDown();
                }
            });

        this._listScrollService
            .listScrollRefresh
            .subscribe(() => {
                // TODO: 60ms延迟重新计算better-scroll
                const timer = setTimeout(() => {
                    $(this.bscrollContentEl.nativeElement).css('min-height', $(this.bscrollEl.nativeElement).height() + 1 + 'px');
                    this.refresh();
                }, 60)
            })
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // this.bscrollEl.nativeElement.style.height = this.height;
        // 为了解决滚动区高度小于滚动区的父元素，会导致better-scroll无法滚动
        $(this.bscrollContentEl.nativeElement).css('min-height', $(this.bscrollEl.nativeElement).height() + 1 + 'px');

        this.bscroll = new BScroll(this.bscrollEl.nativeElement, {
            probeType: 1,
            click: true,
            pullDownRefresh: this.isNeedPullDownRefresh,
            // pullUpLoad: this.isNeedPullUpLoad
        });

        this.bscroll.on('scroll', () => {
        })

        this.bscroll.on('touchEnd', () => {
            this.pullingUp();
            if (this.isPullingUp) {
                this.finishPullUpHandle.emit();
                // this.disable();
            }
        })

        this.bscroll.on('pullingDown', () => {
            this.finishPullDownHandle.emit();
        })

        // this.bscroll.on('pullingUp', () => {
        //     this.isPullingDown = true;
        // })
    }

    /*
        封装上拉下载数据方法
        由于bscroll的pullingUp事件，在上拉时会出现多次执行，导致多次请求数据的问题
     */
    private pullingUp(): void {
        // -1 表示从上往下滑，1 表示从下往上滑，0 表示没有滑动。
        if (!this.bscroll && this.bscroll.movingDirectionY !== 1) { this.isPullingUp = false; return; }
        const currentY = this.bscroll.y;
        // 上拉的距离
        const threshold = 50;
        const targetY = this.bscroll.maxScrollY - threshold;
        // 当前的纵轴上拉值和触发点的目标值比较；小于表示已到达/超过目标值，执行数据刷新
        if (currentY <= targetY) {
            this.isPullingUp = true;
        } else {
            this.isPullingUp = false;
        }
    }

    private disable() { this.bscroll && this.bscroll.disable(); }
    private enable() { this.bscroll && this.bscroll.enable(); }
    private refresh() { this.bscroll && this.bscroll.refresh(); }
    private finishPullUp() { this.bscroll && this.bscroll.finishPullUp(); }
    private finishPullDown() { this.bscroll && this.bscroll.finishPullDown(); }
}
