import { AfterViewInit, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { AppComponentBase } from 'shared/common/app-component-base';
import { BookingPictureEditDto } from 'shared/service-proxies/service-proxies';
import { DefaultUploadPictureGroundId } from 'shared/AppEnums';
import { UploadPictureGalleryComponent } from 'app/shared/common/upload-picture-gallery/upload-picture-gallery.component';

@Component({
    selector: 'app-picture-manage',
    templateUrl: './picture-manage.component.html',
    styleUrls: ['./picture-manage.component.scss']
})
export class PictureManageComponent extends AppComponentBase implements OnInit, AfterViewInit, OnChanges {
    isMutliPic = true;
    existingPicNum: number;
    pictrueIndex: number;
    displayOrder = 0;
    groupId: number = DefaultUploadPictureGroundId.BookingGroup;
    allPictureEdit: BookingPictureEditDto[] = [];

    @Input() pictureInfo: BookingPictureEditDto[] = [];
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
    }

    ngOnChanges(changes: SimpleChanges) {
        this.allPictureEdit = this.pictureInfo;
    }

    uploadPicHandler(): void {
        this.isMutliPic = true;
        if (this.allPictureEdit.length >= 4) {
            this.message.warn('不能超过四张图');
            return;
        }
        this.show(this.allPictureEdit, this.isMutliPic);
    }

    show(bookingPictureEdit?: any, isMutliPic?: boolean): void {
        this.isMutliPic = isMutliPic;
        this.existingPicNum = this.allPictureEdit.length;
        this.uploadPictureModel.show(bookingPictureEdit, this.isMutliPic);
    }

    public getPictureForEdit(pictureForEdit: BookingPictureEditDto) {
        debugger
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
        debugger
        let maxDisplayOrder = 0;
        if (this.allPictureEdit.length > 0) {
            // 在本地上传拿到排序最大的值
            maxDisplayOrder = this.allPictureEdit[this.allPictureEdit.length - 1].displayOrder;
        }
        if (this.isMutliPic) {
            picGalleryForEdit.forEach(element => {
                element.displayOrder = ++maxDisplayOrder;
                this.allPictureEdit.unshift(element);
            });
        } else {
            this.allPictureEdit[this.pictrueIndex].pictureId = picGalleryForEdit[0].pictureId;
            this.allPictureEdit[this.pictrueIndex].pictureUrl = picGalleryForEdit[0].pictureUrl;
        }
        this.sendAllPictureForEdit.emit(this.allPictureEdit);
    }

    deletePic(pictureIndex: number): void {
        this.removeArrayValue(this.allPictureEdit, pictureIndex);
    }

    changePic(pictureIndex: number, displayOrder: number): void {
        this.isMutliPic = false;
        this.pictrueIndex = pictureIndex;
        this.displayOrder = displayOrder;
        this.show(this.allPictureEdit[pictureIndex], this.isMutliPic);
    }

    // 移除数组某个索引的值
    private removeArrayValue(arr: any, index: number): void {
        if (arr.length <= 0) {
            return;
        }
        arr.splice(index, 1);
    }
}