/**
 * 作用：封装保存页码到localstorage中
 */
import { Injectable } from '@angular/core';

@Injectable()
export class AppStorageService {
    // 封装获取localstorage，getItem()
    // 接受一个值，获取localstorage的目标key 
    getStorageValue(key: string) {
        return parseInt(localStorage.getItem(key));
    }
    // 封装设置localstorage，setItem()
    setStorageValue(key: string, value: number) {
        return localStorage.setItem(key, value.toString());
    }
}