import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureManageComponent } from './picture-manage.component';

describe('PictureManageComponent', () => {
  let component: PictureManageComponent;
  let fixture: ComponentFixture<PictureManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
