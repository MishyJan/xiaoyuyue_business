import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class CookiesService {
    domain: string;
    constructor() {
        this.domain = this.getTopDomain(document.domain);
    }

    getTopDomain(domain: string) {
        const reg = '(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}\.?$)';
        const re = new RegExp(reg);
        if (re.test(domain)) {
            return domain.substr(domain.indexOf('.') + 1);
        } else {
            return domain;
        }
    }

    /**
     * Sets a cookie value for given key.
     * This is a simple implementation created to be used by ABP.
     * Please use a complete cookie library if you need.
     * @param {string} key
     * @param {string} value 
     * @param {Date} expireDate (optional). If not specified the cookie will expire at the end of session.
     * @param {string} path (optional)
     */
    setCookieValue(key, value, expireDate, path) {
        let cookieValue = encodeURIComponent(key) + '=';

        if (value) {
            cookieValue = cookieValue + encodeURIComponent(value);
        }

        if (expireDate) {
            cookieValue = cookieValue + '; expires=' + expireDate.toUTCString();
        }

        if (path) {
            cookieValue = cookieValue + '; path=' + path;
        }

        cookieValue = cookieValue + '; domain=' + this.domain;

        document.cookie = cookieValue;
    };
}