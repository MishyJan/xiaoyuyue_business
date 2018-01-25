import { Injectable, Injector } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { SelectListItemDto } from './../service-proxies/service-proxies';

@Injectable()
export class SelectHelperService extends AppComponentBase {
    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    defaultList() {
        return {
            value: '',
            displayText: this.l('Please_Choose')
        };
    };

    defaultListWithText(text: string) {
        return {
            value: '',
            displayText: this.l(text)
        };
    };

    defaultSelectList(): SelectListItemDto {
        const input = new SelectListItemDto();
        input.text = this.l('Please_Choose')
        input.value = '0';
        return input;
    };

    defaultDateSelectList(): SelectListItemDto {
        const input = new SelectListItemDto();
        input.text = '请选择日期';
        input.value = '0';
        return input;
    };

    defaultTimeSelectList(): SelectListItemDto {
        const input = new SelectListItemDto();
        input.text = '请选择时间';
        input.value = '0';
        return input;
    };

    boolList(): Object[] {
        return [
            {
                value: true,
                displayText: this.l('Yes')
            },
            {
                value: false,
                displayText: this.l('No')
            }];
    };

    genderList(): Object[] {
        return [
            {
                value: 1,
                displayText: this.l('Male')
            },
            {
                value: 2,
                displayText: this.l('Female')
            }];
    }

    checkInList(): Object[] {
        return [
            {
                value: false,
                displayText: '未签到'
            },
            {
                value: true,
                displayText: '已签到'
            }];
    }
}
