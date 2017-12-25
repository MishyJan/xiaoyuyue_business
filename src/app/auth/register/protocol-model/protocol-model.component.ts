import { Component, OnInit, ViewChild, Injector, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from 'shared/common/app-component-base';

@Component({
    selector: 'xiaoyuyue-protocol-model',
    templateUrl: './protocol-model.component.html',
    styleUrls: ['./protocol-model.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProtocolModelComponent extends AppComponentBase implements OnInit {
    protocolText: string;
    @ViewChild('protocolModal') modal: ModalDirective;


    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    public show(): void {
        this.modal.show();
        this.getProtocolData();
    }

    public hide(): void {
        this.modal.hide();
    }

    private getProtocolData(): void {
        let cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
        if (!cookieLangValue) {
            cookieLangValue = 'zh-CN';
         }
         const url = `/assets/protocol.${cookieLangValue}.txt`;
        $.ajax({
            url: url,
            dataType: 'text',
            type: 'GET',
            success: result => {
                this.protocolText = result;
            }
        })
    }

}
