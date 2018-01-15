export class ScrollStatusOutput {
    // 上拉状态
    pulledUpActive: boolean;
    // 下拉状态
    pulledDownActive: boolean;
    // 无更多数据
    noMore: boolean;

    constructor(pulledUpActive: boolean = null, pulledDownActive: boolean = null, noMore: boolean = null) {
        this.pulledUpActive = pulledUpActive;
        this.pulledDownActive = pulledDownActive;
        this.noMore = noMore;
    }
}
