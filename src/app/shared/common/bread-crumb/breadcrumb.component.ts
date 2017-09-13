import { AfterViewInit, Component, EventEmitter, Injector, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Breadcrumb, BreadcrumbService } from 'shared/services/bread-crumb.service';

import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'breadcrumb',
    template:
    `<div #template>
    <ng-content></ng-content>
</div>
<div class="" *ngIf="template.children.length == 0">
    <div class="nav-wrapper">
        <div class="breadcrumb" *ngFor="let route of breadcrumbs" [ngClass]="{'last': route.terminal}">
            <!-- disable link of last item -->
            <a href="" *ngIf="!route.terminal" [routerLink]="[route.url]">{{ l(route.displayName) }}</a>
            <span *ngIf="route.terminal">{{ l(route.displayName) }}</span>
        </div>
    </div>
</div>`
})
export class BreadcrumbComponent extends AppComponentBase implements OnDestroy {
    breadcrumbs: Breadcrumb[];

    constructor(injector: Injector,
        breadcrumbService: BreadcrumbService) {
        super(injector);

        this.breadcrumbs = this.breadcrumbService.breadcrumbs;

        this.breadcrumbService.breadcrumbChanged.subscribe((crumbs: Breadcrumb[]) => { this.onBreadcrumbChange(crumbs); });
    }

    ngOnDestroy() {
        this.breadcrumbService.breadcrumbChanged = new EventEmitter<Breadcrumb[]>(false);
    }

    private onBreadcrumbChange(crumbs: Breadcrumb[]) {
        this.breadcrumbs = crumbs;
    }
}
