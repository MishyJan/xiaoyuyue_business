﻿import { AutoFocusDirective } from './auto-focus.directive'
import { BusyIfDirective } from './busy-if.directive';
import { ButtonBusyDirective } from './button-busy.directive'
import { CurrencyInputDirective } from './currency-input.directive';
import { EqualValidator } from './validation/equal-validator.directive';
import { FileDownloadService } from './file-download.service';
import { GridRowClickDirective } from 'shared/utils/grid-row-click.directive';
import { LocalStorageService } from './local-storage.service';
import { MinValueValidator } from './validation/min-value-validator.directive';
import { MobileHeaderDirective } from 'shared/utils/mobile-header.directive';
import { MomentFormatPipe } from './moment-format.pipe';
import { NgModule } from '@angular/core';
import { PasswordComplexityValidator } from './validation/password-complexity-validator.directive'
import { StringEncryptDirective } from './string-encrypt.directive';

@NgModule({
    providers: [
        FileDownloadService,
        LocalStorageService
    ],
    declarations: [
        EqualValidator,
        PasswordComplexityValidator,
        MinValueValidator,
        ButtonBusyDirective,
        AutoFocusDirective,
        BusyIfDirective,
        MomentFormatPipe,
        GridRowClickDirective,
        CurrencyInputDirective,
        MobileHeaderDirective,
        StringEncryptDirective,
    ],
    exports: [
        EqualValidator,
        PasswordComplexityValidator,
        MinValueValidator,
        ButtonBusyDirective,
        AutoFocusDirective,
        BusyIfDirective,
        MomentFormatPipe,
        GridRowClickDirective,
        CurrencyInputDirective,
        MobileHeaderDirective,
        StringEncryptDirective
    ]
})
export class UtilsModule { }