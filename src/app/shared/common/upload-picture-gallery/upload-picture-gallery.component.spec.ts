import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPictureGalleryComponent } from './upload-picture-gallery.component';

describe('UploadPictureModelComponent', () => {
  let component: UploadPictureGalleryComponent;
  let fixture: ComponentFixture<UploadPictureGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPictureGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPictureGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
