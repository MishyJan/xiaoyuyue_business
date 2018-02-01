import { Component, OnInit, Injector } from '@angular/core';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from 'shared/animations/routerTransition';

@Component({
    selector: 'xiaoyuyue-account-condition',
    templateUrl: './account-condition.component.html',
    styleUrls: ['./account-condition.component.scss'],
    animations: [accountModuleAnimation()]
})
export class AccountConditionComponent extends AppComponentBase implements OnInit {
    gridParam: BaseGridDataInputDto
    constructor(
        private injector: Injector,
        private _sessionService: AppSessionService,
    ) {
        super(injector);
        this.gridParam = new BaseGridDataInputDto(this._sessionService);
    }

    ngOnInit() {
    }

}
