/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MobileShareBookingModelComponent } from './share-booking-model.component';

describe('ShareBookingModelComponent', () => {
  let component: MobileShareBookingModelComponent;
  let fixture: ComponentFixture<MobileShareBookingModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileShareBookingModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileShareBookingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
