import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAboutComponent } from './booking-about.component';

describe('BookingAboutComponent', () => {
  let component: BookingAboutComponent;
  let fixture: ComponentFixture<BookingAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
