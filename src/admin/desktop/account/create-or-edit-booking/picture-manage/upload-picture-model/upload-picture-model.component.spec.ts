import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPictureModelComponent } from './upload-picture-model.component';

describe('UploadPictureModelComponent', () => {
  let component: UploadPictureModelComponent;
  let fixture: ComponentFixture<UploadPictureModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPictureModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPictureModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
