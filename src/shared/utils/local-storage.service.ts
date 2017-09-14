import * as localForage from 'localforage';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocalStorageService {

    // 封装获取localForage，getItem()
    // 接受一个值，获取localForage的目标key
    getItem(key: string, callback: any) {
        return localForage.getItem(key).then(result => {
            if (result) {
                return this.deepCopy(result);
            } else {
                return callback().toPromise().then(dataResult => {
                    result = dataResult;
                    localForage.setItem(key, dataResult);
                    return this.deepCopy(result);
                });
            }
        });
    }

    setItem(key, value): void {
        if (!localForage) {
            return;
        }

        localForage.setItem(key, value);
    };

    removeItem(key: string): void {
        localForage.removeItem(key);
    }

    deepCopy(input) {
        if (typeof input === 'object' && isNaN(input.length)) {
            const deepCopyResult = function (source) {
                const result = {};
                // tslint:disable-next-line:forin
                for (const key in source) {
                    result[key] = typeof source[key] === 'object' ? deepCopyResult(source[key]) : source[key];
                }
                return result;
            }
            return deepCopyResult(input);
        } else {
            return input.concat();
        }
    }
}