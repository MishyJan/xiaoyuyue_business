/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookingAccessSourceComponent } from './booking-access-source.component';

describe('BookingAccessSourceComponent', () => {
  let component: BookingAccessSourceComponent;
  let fixture: ComponentFixture<BookingAccessSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingAccessSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAccessSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
