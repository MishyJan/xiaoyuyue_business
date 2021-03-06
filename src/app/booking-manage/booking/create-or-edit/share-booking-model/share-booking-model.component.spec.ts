import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareBookingModelComponent } from './share-booking-model.component';

describe('ShareBookingModelComponent', () => {
  let component: ShareBookingModelComponent;
  let fixture: ComponentFixture<ShareBookingModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareBookingModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareBookingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
