import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { BookingPictureEditDto } from 'shared/service-proxies/service-proxies';
import { UploadPictureGalleryComponent } from 'app/shared/common/upload-picture-gallery/upload-picture-gallery.component';
import { element } from 'protractor';

@Component({
    selector: 'app-picture-manage',
    templateUrl: './picture-manage.component.html',
    styleUrls: ['./picture-manage.component.scss']
})
export class PictureManageComponent extends AppComponentBase implements OnInit {
    existingPicNum: number;
    pictrueIndex: number;
    displayOrder: number = 0;
    allPictureEdit: BookingPictureEditDto[] = [];

    @Input() pictureInfo: BookingPictureEditDto[];
    @Output() sendAllPictureForEdit: EventEmitter<BookingPictureEditDto[]> = new EventEmitter();
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

    uploadPicHandler(): void {
        // if (this.allPictureEdit.length >= 4) {
        //     this.message.warn('不能超过四张图');
        //     return;
        // }
        this.show();
    }

    show(): void {
        if (this.allPictureEdit.length >= 4) {
            this.message.warn('不能超过四张图');
            return;
        }
        // 统计已有的图片数量
        this.existingPicNum = this.allPictureEdit.length;
        this.uploadPictureModel.show();
    }

    public getPictureForEdit(pictureForEdit: BookingPictureEditDto) {
        if (this.pictrueIndex != null && this.pictrueIndex >= 0) {
            this.displayOrder = this.allPictureEdit[this.allPictureEdit.length - 1].displayOrder;
            ++this.displayOrder;
            this.allPictureEdit[this.pictrueIndex] = pictureForEdit;
            this.sendAllPictureForEdit.emit(this.allPictureEdit);
            this.pictrueIndex = null;
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

    public getPicGalleryForEdit(picGalleryForEdit: BookingPictureEditDto[]): void {
        let maxDisplayOrder = 0;
        if (this.allPictureEdit.length > 0) {
            // 在本地上传拿到排序最大的值
            maxDisplayOrder = this.allPictureEdit[this.allPictureEdit.length - 1].displayOrder;
        }
        picGalleryForEdit.forEach(element => {
            element.displayOrder = ++maxDisplayOrder;
            this.allPictureEdit.unshift(element);
        });
        this.sendAllPictureForEdit.emit(this.allPictureEdit);
    }

    deletePic(pictureIndex: number): void {
        this.removeArrayValue(this.allPictureEdit, pictureIndex);
    }

    changePic(pictureIndex: number, displayOrder: number): void {
        this.pictrueIndex = pictureIndex;
        this.displayOrder = displayOrder;
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