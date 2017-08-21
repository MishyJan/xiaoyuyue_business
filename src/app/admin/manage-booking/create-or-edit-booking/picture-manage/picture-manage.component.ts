import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from "shared/common/app-component-base";
import { BookingPictureEditDto } from "shared/service-proxies/service-proxies";
import { UploadPictureGalleryComponent } from 'app/admin/shared/upload-picture-gallery/upload-picture-gallery.component';

@Component({
    selector: 'app-picture-manage',
    templateUrl: './picture-manage.component.html',
    styleUrls: ['./picture-manage.component.scss']
})
export class PictureManageComponent extends AppComponentBase implements OnInit {
    pictrueIndex: number;
    displayOrder: number = 0;
    @Output() sendAllPictureForEdit: EventEmitter<BookingPictureEditDto[]> = new EventEmitter();
    allPictureEdit: BookingPictureEditDto[] = [];
    @Input() pictureInfo: BookingPictureEditDto[];

    @ViewChild('uploadPictureModel') uploadPictureModel: UploadPictureGalleryComponent;


    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let self = this;
        setTimeout(function () {
            if (self.pictureInfo) {
                self.allPictureEdit = self.pictureInfo;
            }
        }, 1000)
    }

    show(): void {
        this.uploadPictureModel.show();
    }

    getPictureForEdit(pictureForEdit: BookingPictureEditDto) {
        if (this.pictrueIndex >= 0) {
            this.displayOrder = this.allPictureEdit[this.allPictureEdit.length - 1].displayOrder;
            ++this.displayOrder;
            this.allPictureEdit[this.pictrueIndex] = pictureForEdit;
            this.sendAllPictureForEdit.emit(this.allPictureEdit);
            console.log(this.allPictureEdit);
            return;
        }

        if (this.allPictureEdit.length > 0) {
            this.displayOrder = this.allPictureEdit[0].displayOrder;
            ++this.displayOrder;
        } else {
            this.displayOrder = 0;
        }
        pictureForEdit.displayOrder = this.displayOrder;

        this.allPictureEdit.unshift(pictureForEdit);
        this.sendAllPictureForEdit.emit(this.allPictureEdit);
    }

    deletePic(pictureIndex: number): void {
        this.removeArrayValue(this.allPictureEdit, pictureIndex);
    }

    changePic(pictureIndex: number, displayOrder: number): void {
        this.pictrueIndex = pictureIndex;
        this.displayOrder = displayOrder;
        console.log(this.pictrueIndex);

        this.show();
    }

    // 移除数组某个索引的值
    private removeArrayValue(arr: any, index: number): void {
        if (arr.length <= 0) {
            return;
        }
        arr.splice(index, 1);
    }

}