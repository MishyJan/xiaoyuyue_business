import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPictureNoneGalleryComponent } from './upload-picture-none-gallery.component';

describe('UploadPictureNoneGalleryComponent', () => {
  let component: UploadPictureNoneGalleryComponent;
  let fixture: ComponentFixture<UploadPictureNoneGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPictureNoneGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPictureNoneGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
