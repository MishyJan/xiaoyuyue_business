import { SelectListItemDto } from './../service-proxies/service-proxies';

export class SelectHelper {
    static DefaultList() {
        return {
            value: '',
            displayText: '请选择'
        };
    };

    static DefaultSelectList(): SelectListItemDto {
        const input = new SelectListItemDto();
        input.text = '请选择';
        input.value = '0';
        return input;
    };

    static ProvinceSelectList(): SelectListItemDto {
        const input = new SelectListItemDto();
        input.text = '省/市';
        input.value = '0';
        return input;
    };


    static BoolList(): Object[] {
        return [
            {
                value: true,
                displayText: '是',
            },
            {
                value: false,
                displayText: '否',
            }];
    };

    static GenderList(): Object[] {
        return [
            {
                value: 1,
                displayText: '男',
            },
            {
                value: 2,
                displayText: '女',
            }];
    }
}
