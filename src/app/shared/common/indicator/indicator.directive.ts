import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[xiaoyuyueIndicator]'
})
export class IndicatorDirective {
    barColor: string;
    _$initIndicatorEle: JQuery<HTMLElement>;

    @Input() uuid: string;
    @Input() criticalValue: number;
    constructor(
        private _element: ElementRef,
    ) { }

    ngAfterViewInit(): void {
        this._$initIndicatorEle = $(this._element.nativeElement);
        this.initIndicator(this.uuid);
    }

    // 初始化圆形进度条插件
    initIndicator(id: string): void {
        const self = this;
        this.barColor = this.switchColorState(this.criticalValue);
        $('.indicator-container-' + id + '').radialIndicator({
            minValue: 0,
            maxValue: 100,
            radius: 28,
            barColor: self.barColor,
            barWidth: 4,
            initValue: self.criticalValue,
            roundCorner: true,
            percentage: true
        });
    }

    // 进度颜色状态
    switchColorState(value: number): string {
        const colorState1 = '#02AFF3';
        const colorState2 = '#00B200';
        const colorState3 = '#FF9641';
        const colorState4 = '#E32600';

        if (0 <= value && value < 30) {
            return colorState1;
        } else if (30 <= value && value < 60) {
            return colorState2;
        } else if (30 <= value && value < 60) {
            return colorState3;
        } else {
            return colorState4;
        }
    }
}