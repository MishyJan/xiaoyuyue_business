﻿import { Moment, MomentInput } from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'momentFormat' })
export class MomentFormatPipe implements PipeTransform {
    transform(value: MomentInput, format: string) {
        return moment(value).format(format);
    }
}