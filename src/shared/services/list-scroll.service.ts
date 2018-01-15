import { Injectable, EventEmitter } from '@angular/core';
import { ScrollStatusOutput } from 'app/shared/utils/list-scroll.dto';

@Injectable()
export class ListScrollService {
    listScrollFinished = new EventEmitter<ScrollStatusOutput>();

    constructor() {
     }
}