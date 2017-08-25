import { Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';

const hasClass = (el, className) => new RegExp(className).test(el.className)

const isChildOf = (el, className) => {
    while (el && el.parentElement) {
        if (hasClass(el.parentElement, className)) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
};

const eq = (s1, s2) => s1.toLowerCase() === s2.toLowerCase();

const closest = (el, nodeName) => {
    while (el && el.parentElement) {
        if (eq(el.nodeName, nodeName) || eq(el.parentElement.nodeName, nodeName)) {
            return el.parentElement;
        }
        el = el.parentElement;
    }
    return null;
};

@Directive({ selector: '[GridRowClick]' })
export class GridRowClickDirective implements OnInit {

    @Output() public editRow: EventEmitter<number> = new EventEmitter<number>();

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    public ngOnInit(): void {
        this.renderer.listen(
            this.el.nativeElement,
            'click',
            ({ target }) => {
                const tr = closest(target, 'tr');

                if (tr && !hasClass(tr, 'k-grid-edit-row') && !hasClass(tr.parentElement, 'k-grid-header')) {
                    this.editRow.emit(tr.rowIndex - 1);
                }
            }
        );
    }
}
