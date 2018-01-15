import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ListScrollService {
    pullDownFinished = new EventEmitter<boolean>(false);
    pullUpFinished = new EventEmitter<boolean>(false);

    constructor() {
     }
}