/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { BookingOrderListComponent } from './booking-order-list.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('BookingOrderListComponent', () => {
  let component: BookingOrderListComponent;
  let fixture: ComponentFixture<BookingOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
