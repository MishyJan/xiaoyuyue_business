import { Directive, ElementRef, OnInit, AfterViewInit, Injector } from '@angular/core';
import { AppComponentBase } from 'shared/common/app-component-base';

@Directive({
    selector: '[appStringEncrypt]'
})
export class StringEncryptDirective extends AppComponentBase implements AfterViewInit {
    _$element: any;
    stringEncrypt: string;

    constructor(
        private injector: Injector,
        private _element: ElementRef
    ) {
        super(injector);
    }


    ngAfterViewInit() {
        this._$element = this._element.nativeElement;
        this.stringEncrypt = this._$element.innerHTML;
        this.encryptHanldle();
    }

    private encryptHanldle(): void {
        if (!this.stringEncrypt) {
            return;
        }

        if (this.isValidPhoneNum(this.stringEncrypt)) {
            this._$element.innerHTML = this.symbolTransform('•', this.stringEncrypt.length - 4) + this.stringEncrypt.substr(this.stringEncrypt.length - 4);
        }

        if (this.isValidEmailAddress(this.stringEncrypt)) {
            this._$element.innerHTML = this.stringEncrypt.substr(0, 4) + this.symbolTransform('•', this.stringEncrypt.length - (4 + this.stringEncrypt.length - this.stringEncrypt.indexOf('@'))) + this.stringEncrypt.substr(-this.stringEncrypt.length + this.stringEncrypt.indexOf('@'));
        }
    }

    private symbolTransform(symbol: string = '•', length: number = 0): string {
        let tempString = '';
        for (let i = 0; i < length; i++) {
            tempString += symbol;
        }
        return tempString;
    }
}
