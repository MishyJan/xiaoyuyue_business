import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOrgBgComponent } from './upload-org-bg.component';

describe('UploadOrgBgComponent', () => {
  let component: UploadOrgBgComponent;
  let fixture: ComponentFixture<UploadOrgBgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadOrgBgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOrgBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
