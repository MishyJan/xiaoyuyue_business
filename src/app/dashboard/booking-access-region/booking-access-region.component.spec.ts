/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookingAccessRegionComponent } from './booking-access-region.component';

describe('BookingAccessRegionComponent', () => {
  let component: BookingAccessRegionComponent;
  let fixture: ComponentFixture<BookingAccessRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingAccessRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAccessRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
