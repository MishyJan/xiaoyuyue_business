/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BookingSaturationComponent } from './booking-saturation.component';

describe('BookingSaturationComponent', () => {
  let component: BookingSaturationComponent;
  let fixture: ComponentFixture<BookingSaturationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSaturationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSaturationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
