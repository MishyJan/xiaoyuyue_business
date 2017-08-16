export class SelectHelper {
    static defaultList() {
        return {
            value: '',
            displayText: '请选择'
        };
    };

    static boolList(): Object[] {
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

    static genderList(): Object[] {
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