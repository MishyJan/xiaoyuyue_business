import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Attribute, Directive, forwardRef } from '@angular/core';

//Got from: https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})
export class EqualValidator implements Validator {
    constructor(
        @Attribute('validateEqual') public validateEqual: string,
        @Attribute('reverse') public reverse: string
        ) {
    }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true: false;
    }

    validate(control: AbstractControl): { [key: string]: any } {
        let pairControl = control.root.get(this.validateEqual);
        if (!pairControl) {
            return null;
        }

        let value = control.value;
        let pairValue = pairControl.value;

        if (!value && !pairValue) {
            return null;
        }

        if(this.isReverse) {
            if (value === pairValue) {
                if(pairControl.errors){
                    delete pairControl.errors['validateEqual'];
                }

                if (!Object.keys(pairControl.errors).length) {
                    pairControl.setErrors(null);
                }
            } else {
                pairControl.setErrors({
                    validateEqual: false
                })
            }

            return null;
        } else {
            if (value !== pairValue) {
                return {
                    validateEqual: false
                }
            }
        }
    }
}