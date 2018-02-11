import { AfterViewInit, Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { EditionSubscriptionServiceProxy, EditionWithFeaturesDto, EditionsViewOutput, FlatFeatureSelectDto, PaymentServiceProxy, SubscriptionPaymentListDto } from 'shared/service-proxies/service-proxies';

import { AccountInfo } from 'app/shared/utils/account-info';
import { AppComponentBase } from 'shared/common/app-component-base';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { GetCurrentFeatures } from 'shared/AppConsts';
import { Moment } from 'moment';
import { PaysType } from 'shared/AppEnums';
import { accountModuleAnimation } from 'shared/animations/routerTransition';
import { ScrollStatusOutput } from 'app/shared/utils/list-scroll.dto';
import { ListScrollService } from 'shared/services/list-scroll.service';

@Component({
    selector: 'xiaoyuyue-account-condition',
    templateUrl: './account-condition.component.html',
    styleUrls: ['./account-condition.component.scss'],
    animations: [accountModuleAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class AccountConditionComponent extends AppComponentBase implements OnInit, AfterViewInit {
    allMobilePaymentHistoryData: any[] = [];
    totalItems: number;
    updateDataIndex = -1;
    scrollStatusOutput: ScrollStatusOutput;
    bookingStatisticCountText: string;
    outletStatisticCountText: string;
    isHighestEdition: boolean;
    currentEditions: EditionWithFeaturesDto;
    allFeatures: FlatFeatureSelectDto[];
    accountInfo: AccountInfo = new AccountInfo();
    isShowPaymentHistory = false;
    mobilePaymentHistoryData: SubscriptionPaymentListDto[] = [];
    showConditionContent = false;
    gridParam: BaseGridDataInputDto
    paymentHistoryData = new AppGridData();
    constructor(
        private injector: Injector,
        private _listScrollService: ListScrollService,
        private _paymentService: PaymentServiceProxy,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy
    ) {
        super(injector);
        this.gridParam = new BaseGridDataInputDto(this.appSession);
    }

    ngOnInit() {
        this.isHighestEdition = this.appSession.tenant.edition.isHighestEdition;

    }

    ngAfterViewInit() {
        this.getAccountInfo();
        this.getCurrentEditions();
        this.isMobile($('.mobile-account-condition')) ? this.mobileLoadPaymentHistoryData() : this.loadPaymentHistoryData();
    }

    // 获取历史账单
    loadPaymentHistoryData(): void {
        const loadData = () => {
            return this._paymentService
                .getPaymentHistory(
                this.gridParam.GetSortingString(),
                this.gridParam.MaxResultCount,
                this.gridParam.SkipCount);
        };

        this.paymentHistoryData.query(loadData, false, () => {
        });
    }

    // 获取当前版本信息
    getCurrentEditions(): void {
        this._editionSubscriptionService
            .getCurrentEdition()
            .subscribe(result => {
                this.allFeatures = result.allFeatures;
                this.currentEditions = result.editionWithFeatures;
            })
    }

    // 获取指定版本的显示名称
    getEditionDisplayName(name: string): string {
        let displayName = '';
        this.allFeatures.forEach((element: FlatFeatureSelectDto) => {
            if (name === 'App.MaxBookingCount') {
                displayName = GetCurrentFeatures.AllFeatures['App.MaxBookingCount'].value === '0' ?
                    element.displayName + '不限制' :
                    element.displayName + GetCurrentFeatures.AllFeatures['App.MaxBookingCount'].value + '个';
                return;
            }
            if (name === 'App.MaxOutletCount') {
                displayName = GetCurrentFeatures.AllFeatures['App.MaxOutletCount'].value === '0' ?
                    element.displayName + '不限制' :
                    element.displayName + GetCurrentFeatures.AllFeatures['App.MaxBookingCount'].value + '个';
                return;
            }
            if (element.name === name) {
                displayName = element.displayName;
                return;
            }
        });
        return displayName;
    }

    // 获取账户信息
    getAccountInfo(): void {
        this.accountInfo.tenantName = this.appSession.tenant.tenancyName;
        this.accountInfo.editionId = this.appSession.tenant.edition.id;
        this.accountInfo.editionDisplayName = this.appSession.tenant.edition.displayName;
        this.accountInfo.editionTimeLimit = this.editionTimeLimitIsValid(this.appSession.tenant.subscriptionEndDateUtc)
        this.accountInfo.subCreatedBookingCount = this.appSession.tenant.bookingNum;
        this.accountInfo.subCreatedOutletCount = this.appSession.tenant.outletNum;
        this.accountInfo.maxBookingCount = GetCurrentFeatures.AllFeatures['App.MaxBookingCount'].value;
        this.accountInfo.maxOutletCount = GetCurrentFeatures.AllFeatures['App.MaxOutletCount'].value;
        this.transferOutletAndBookingContentText();
    }

    /*
        判断版本到期时间是否有效
        @return string
        有效返回时间字符串，否则返回免费版的"永久有效"
     */
    private editionTimeLimitIsValid(editionTimeLimit: Moment): string {
        let timeLimitName: string;
        if (editionTimeLimit) {
            timeLimitName = this.t(editionTimeLimit);
            this.accountInfo.paysTypeDisplayName = '续费会员';
            this.accountInfo.paysType = PaysType.RenewalsMembership;
        } else {
            timeLimitName = '永久有效';
            this.accountInfo.paysTypeDisplayName = '开通会员';
            this.accountInfo.paysType = PaysType.JoinMembership;
        }
        return timeLimitName;
    }

    // 根据是否正在试用中，添加 试用 文案
    private inTrialPeriodTransText(editionDisName: string): string {
        return this.appSession.tenant.isInTrialPeriod ? editionDisName + '(试用中)' : editionDisName;
    }

    // 转换门店统计文本内容 和 预约统计内容
    private transferOutletAndBookingContentText(): void {
        this.outletStatisticCountText = this.accountInfo.maxOutletCount === '0' ?
            '不限制' : // 数量不限制
            `${this.accountInfo.subCreatedOutletCount} / ${this.accountInfo.maxOutletCount}`;

        this.bookingStatisticCountText = this.accountInfo.maxBookingCount === '0' ?
            '不限制' : // 数量不限制
            `${this.accountInfo.subCreatedBookingCount} / ${this.accountInfo.maxBookingCount}`;

    }

    // 转换预约统计文本内容

    // 切换页码
    public pageChange(event: PageChangeEvent): void {
        this.gridParam.CurrentPage = (this.gridParam.SkipCount + this.gridParam.MaxResultCount) / this.gridParam.MaxResultCount;
        this.gridParam.SkipCount = this.gridParam.MaxResultCount * (this.gridParam.CurrentPage - 1);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;
        this.loadPaymentHistoryData();
    }

    /* 移动端代码 */
    // scrollHandleBack: 接收一个回调函数，控制下拉刷新，上拉加载的状态
    mobileLoadPaymentHistoryData(scrollHandleBack?: any): void {
        this._paymentService
            .getPaymentHistory(
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount)
            .finally(() => {
                scrollHandleBack && scrollHandleBack();
            })
            .subscribe(result => {
                this.mobilePaymentHistoryData = result.items;
                this.totalItems = result.totalCount;
                if (this.mobilePaymentHistoryData.length > 0 && this.updateDataIndex < 0) {
                    this.allMobilePaymentHistoryData.push(this.mobilePaymentHistoryData);
                } else {
                    this.allMobilePaymentHistoryData[this.updateDataIndex] = this.mobilePaymentHistoryData;
                }
            })
    }

    // 由于tabset导致初始化better-scroll失效，尝试把历史账单DOM结构移除tabset，点击后显示DOM
    selectPaymentHistory(toggle: boolean): void {
        this.isShowPaymentHistory = toggle;
    }

    // 下拉刷新
    public pullDownRefresh(): void {
        this.updateDataIndex = 0;
        this.gridParam.SkipCount = 0;
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledDownActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.mobileLoadPaymentHistoryData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.pulledDownActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }

    // 上拉加载
    public pullUpLoad(): void {
        this.updateDataIndex = -1;
        let totalCount = 0;
        this.allMobilePaymentHistoryData.forEach(personBookingTotalCount => {
            personBookingTotalCount.forEach(element => {
                totalCount++;
            });
        });
        this.gridParam.SkipCount = totalCount;
        if (this.gridParam.SkipCount >= this.totalItems) {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.noMore = true;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
            return;
        }
        this.scrollStatusOutput = new ScrollStatusOutput();
        this.scrollStatusOutput.pulledUpActive = true;
        this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        this.mobileLoadPaymentHistoryData(() => {
            this.scrollStatusOutput = new ScrollStatusOutput();
            this.scrollStatusOutput.pulledUpActive = false;
            this._listScrollService.listScrollFinished.emit(this.scrollStatusOutput);
        });
    }
}
