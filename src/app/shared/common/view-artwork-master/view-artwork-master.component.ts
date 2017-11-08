import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'xiaoyuyue-view-artwork-master',
    templateUrl: './view-artwork-master.component.html',
    styleUrls: ['./view-artwork-master.component.scss']
})
export class ViewArtworkMasterComponent extends AppComponentBase implements OnInit {
    isShow: boolean = false;
    viewArtworkUrl: string;

    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    showModel(viewArtworkUrl: string): void {
        this.isShow = true;
        this.viewArtworkUrl = viewArtworkUrl;
    }

    hideModel(): void {
        this.isShow = false;
    }
}
