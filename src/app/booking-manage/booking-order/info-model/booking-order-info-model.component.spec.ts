/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { BookingOrderInfoModelComponent } from './booking-order-info-model.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CustomerForEditModelComponent', () => {
  let component: BookingOrderInfoModelComponent;
  let fixture: ComponentFixture<BookingOrderInfoModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookingOrderInfoModelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingOrderInfoModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
