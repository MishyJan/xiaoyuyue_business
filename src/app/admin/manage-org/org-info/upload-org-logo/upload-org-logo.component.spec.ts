import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOrgLogoComponent } from './upload-org-logo.component';

describe('UploadOrgLogoComponent', () => {
  let component: UploadOrgLogoComponent;
  let fixture: ComponentFixture<UploadOrgLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadOrgLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOrgLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
