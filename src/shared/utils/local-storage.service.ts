import * as _ from 'lodash';
import * as localForage from 'localforage';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocalStorageService {

    // 封装获取localForage，getItem()
    // 接受一个值，获取localForage的目标key
    getItem<T>(key: string, callback: any) {
        return localForage.getItem<T>(key).then(result => {
            if (result) {
                return _.cloneDeep<T>(result);
            } else {
                return callback().toPromise().then(dataResult => {
                    result = dataResult;
                    localForage.setItem(key, dataResult);
                    return _.cloneDeep<T>(result);
                });
            }
        });
    }

    getItemOrNull<T>(key: string) {
        return localForage.getItem<T>(key).then(result => {
            if (result) {
                return _.cloneDeep<T>(result);
            } else {
                return null;
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
}