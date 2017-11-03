import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[mobileheader]'
})
export class MobileHeaderDirective implements OnInit {

    private _$titleSpan: JQuery;

    @Input() set mobileheader(title: string) {
        this.refreshState();
    }

    constructor(
        private _element: ElementRef
    ) {
        this._$titleSpan = $(this._element.nativeElement);
    }

    ngOnInit(): void {

    } ac

    refreshState(): void {
        if (!this._$titleSpan) {
            return;
        }

        if (window.location.href.indexOf('dashboard') > 0) {
            this._$titleSpan.addClass('hidden');
        } else {
            this._$titleSpan.removeClass('hidden');
        }
    }
}

