import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'LuosimaoCaptcha',
    templateUrl: './luosimao-captcha.component.html',
})

export class LuosimaoCaptcha {
    getResponse(resp) {
        console.log(resp);  // resp 即验证成功后获取的值
    }
}