/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MobileUploadPictureComponent } from './mobile-upload-picture.component';

describe('MobileUploadPictureComponent', () => {
  let component: MobileUploadPictureComponent;
  let fixture: ComponentFixture<MobileUploadPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileUploadPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileUploadPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
