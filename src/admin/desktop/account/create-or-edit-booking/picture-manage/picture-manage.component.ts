import { Component, OnInit, Injector, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { AppComponentBase } from "shared/common/app-component-base";
import { BookingPictureEditDto } from "shared/service-proxies/service-proxies";
import { UploadPictureModelComponent } from "admin/desktop/account/create-or-edit-booking/picture-manage/upload-picture-model/upload-picture-model.component";

@Component({
  selector: 'app-picture-manage',
  templateUrl: './picture-manage.component.html',
  styleUrls: ['./picture-manage.component.scss']
}) 
export class PictureManageComponent extends AppComponentBase implements OnInit {
  @Output() sendPictureForEdit: EventEmitter<BookingPictureEditDto> = new EventEmitter();
  allPictureUrl: string[];
  @Input() pictureInfo: BookingPictureEditDto[];

  @ViewChild('uploadPictureModel') uploadPictureModel: UploadPictureModelComponent;


  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    console.log(this.pictureInfo);
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(this.pictureInfo);
  }

  createUser(): void {
    this.uploadPictureModel.show();
  }

  getAllPictureUrl(allPictureUrl: string[]) {
    this.allPictureUrl = allPictureUrl;
  }
  getPictureForEdit(pictureForEdit: BookingPictureEditDto) {
    this.sendPictureForEdit.emit(pictureForEdit);
  }

}