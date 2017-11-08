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
    isMutliSelect = true;
    pictrueIndex: number;
    displayOrder = 0;
    groupId: number = DefaultUploadPictureGroundId.BookingGroup;

    @Input() selectedPictures: BookingPictureEditDto[] = [];
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
        this.selectedPictures = this.selectedPictures;
    }

    uploadPicHandler(): void {
        this.isMutliSelect = true;
        if (this.selectedPictures.length >= 4) {
            this.message.warn('不能超过四张图');
            return;
        }
        this.show(this.selectedPictures, this.isMutliSelect);
    }

    show(bookingPictureEdit?: any, isMutliPic?: boolean): void {
        this.isMutliSelect = isMutliPic;
        this.uploadPictureModel.show(bookingPictureEdit, this.isMutliSelect);
    }

    public getPictureForEdit(pictureForEdit: BookingPictureEditDto) {
        if (this.pictrueIndex != null && this.pictrueIndex >= 0) {
            this.displayOrder = this.selectedPictures[this.selectedPictures.length - 1].displayOrder;
            ++this.displayOrder;
            this.selectedPictures[this.pictrueIndex] = pictureForEdit;
            this.sendAllPictureForEdit.emit(this.selectedPictures);
            this.pictrueIndex = null;
            return;
        }

        if (this.selectedPictures.length > 0) {
            this.displayOrder = this.selectedPictures[0].displayOrder;
            ++this.displayOrder;
        } else {
            this.displayOrder = 0;
        }
        pictureForEdit.displayOrder = this.displayOrder;

        this.selectedPictures.unshift(pictureForEdit);
        this.sendAllPictureForEdit.emit(this.selectedPictures);
    }

    public getPicGalleryForEdit(picGalleryForEdit: BookingPictureEditDto[]): void {
        let maxDisplayOrder = 0;
        if (this.selectedPictures.length > 0) {
            // 在本地上传拿到排序最大的值
            maxDisplayOrder = this.selectedPictures[this.selectedPictures.length - 1].displayOrder;
        }
        if (this.isMutliSelect) {
            picGalleryForEdit.forEach(element => {
                element.displayOrder = ++maxDisplayOrder;
                this.selectedPictures.unshift(element);
            });
        } else {
            this.selectedPictures[this.pictrueIndex].pictureId = picGalleryForEdit[0].pictureId;
            this.selectedPictures[this.pictrueIndex].pictureUrl = picGalleryForEdit[0].pictureUrl;
        }
        this.sendAllPictureForEdit.emit(this.selectedPictures);
    }

    deletePic(pictureIndex: number): void {
        this.removeArrayValue(this.selectedPictures, pictureIndex);
    }

    changePic(pictureIndex: number, displayOrder: number): void {
        this.isMutliSelect = false;
        this.pictrueIndex = pictureIndex;
        this.displayOrder = displayOrder;
        this.show(this.selectedPictures[pictureIndex], this.isMutliSelect);
    }

    // 移除数组某个索引的值
    private removeArrayValue(arr: any, index: number): void {
        if (arr.length <= 0) {
            return;
        }
        arr.splice(index, 1);
    }
}