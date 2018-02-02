export class AccountEdition {
    // 版本名称
    name: string;
    // 版本号
    value: number;
    // 版本内容
    content: string[];
}

export class AccountEditionBuild {
    freeEdition: AccountEdition = new AccountEdition();
    proEdition: AccountEdition = new AccountEdition();
    constructor() {
        this.mockInitEditionData();
    }
    // mock数据
    private mockInitEditionData(): void {
        this.freeEdition.name = '免费版';
        this.freeEdition.value = 1;
        this.freeEdition.content = ['￥0/年', '可创建3家门店', '4个预约', '可保存应约人列表(图片格式)', '首页呈现5项数据列表'];

        this.proEdition.name = '高级版';
        this.proEdition.value = 2;
        this.proEdition.content = ['￥1999/年', '可创建10家门店', '50个预约', '可保存应约人列表(图片、Excel等)', '首页呈现10项数据列表', '应约界面免广告', '短信服务费9折优惠', '签到页植入门店广告', '专人服务', '地图服务'];
    }
}
