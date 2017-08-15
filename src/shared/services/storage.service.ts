import { Observable } from 'rxjs/Rx';
/**
 * 作用：封装保存页码到localstorage中
 */
import { Injectable } from '@angular/core';

@Injectable()
export class AppStorageService {

    // 封装获取localstorage，getItem()
    // 接受一个值，获取localstorage的目标key
    getItem(key: string, callback: any) {
        const cacheString = localStorage.getItem(key);
        let result;
        if (cacheString) {
            result = JSON.parse(cacheString);
        } else {
            callback().subscribe(callbackResult => {
                result = callbackResult;
                this.setItem(key, JSON.stringify(callbackResult));
            });
        }

        return Observable.of(result);
    }

    // 封装设置localstorage，setItem()
    setItem(key: string, value: string) {
        return localStorage.setItem(key, value);
    }

    getStorageValue(key: string) {
        return parseInt(localStorage.getItem(key));
    }

    // 封装设置localstorage，setItem()
    setStorageValue(key: string, value: number) {
        return localStorage.setItem(key, value.toString());
    }
}