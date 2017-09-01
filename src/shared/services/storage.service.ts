import { GetWorldMapOutput } from './../service-proxies/service-proxies';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

/**
 * 作用：封装保存页码到localstorage中
 */

@Injectable()
export class AppStorageService {

    // 封装获取localstorage，getItem()
    // 接受一个值，获取localstorage的目标key
    getItem(key: string, callback: any) {
        const cacheString = localStorage.getItem(key);
        let result;
        if (cacheString) {
            result = JSON.parse(cacheString);
            return Observable.of(result);
        } else {
            return callback().flatMap(function (dataResult) {
                result = dataResult;
                localStorage.setItem(key, JSON.stringify(dataResult));
                return Observable.of(result);
            });
        }
    }

    // 封装设置localstorage，setItem()
    setItem(key: string, value: string) {
        return localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        return localStorage.removeItem(key);
    }

    getStorageValue(key: string) {
        return parseInt(localStorage.getItem(key));
    }

    // 封装设置localstorage，setItem()
    setStorageValue(key: string, value: number) {
        return localStorage.setItem(key, value.toString());
    }
}