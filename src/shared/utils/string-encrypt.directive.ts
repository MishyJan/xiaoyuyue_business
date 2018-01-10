import { Directive, ElementRef, OnInit, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[appStringEncrypt]'
})
export class StringEncryptDirective implements AfterViewInit {
    _$element: any;
    stringEncrypt: string;

    constructor(
        private _element: ElementRef
    ) { }


    ngAfterViewInit() {
        this._$element = this._element.nativeElement;
        this.stringEncrypt = this._$element.innerHTML;
        this.encryptHanldle();
    }

    private encryptHanldle(): void {
        if (!this.stringEncrypt) {
            return;
        }
        this._$element.innerHTML = '•••••••' + this.stringEncrypt.substr(this.stringEncrypt.length - (this.stringEncrypt.length - 4));
    }
}