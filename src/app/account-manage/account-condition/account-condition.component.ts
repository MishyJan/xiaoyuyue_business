import { Component, OnInit, Injector, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from 'shared/animations/routerTransition';
import { PaymentServiceProxy, SubscriptionPaymentListDto } from 'shared/service-proxies/service-proxies';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';

@Component({
    selector: 'xiaoyuyue-account-condition',
    templateUrl: './account-condition.component.html',
    styleUrls: ['./account-condition.component.scss'],
    animations: [accountModuleAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class AccountConditionComponent extends AppComponentBase implements OnInit, AfterViewInit {
    isShowPaymentHistory = false;
    mobilePaymentHistoryData: SubscriptionPaymentListDto[];
    showConditionContent = false;
    gridParam: BaseGridDataInputDto
    paymentHistoryData = new AppGridData();
    constructor(
        private injector: Injector,
        private _sessionService: AppSessionService,
        private _paymentService: PaymentServiceProxy
    ) {
        super(injector);
        this.gridParam = new BaseGridDataInputDto(this._sessionService);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
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
    mobileLoadPaymentHistoryData(): void {
        this._paymentService
            .getPaymentHistory(
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount)
            .subscribe(result => {
                this.mobilePaymentHistoryData = result.items;
            })
    }

    isShowConditionContent(): void {
        this.showConditionContent = !this.showConditionContent;
    }

    // 由于tabset导致初始化better-scroll失效，尝试把历史账单DOM结构移除tabset，点击后显示DOM
    selectPaymentHistory(toggle: boolean): void {
        this.isShowPaymentHistory = toggle;
    }
}
