/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { CustomerInfoModelComponent } from './customer-info-model.component';
import { DebugElement } from '@angular/core';

describe('CustomerForEditModelComponent', () => {
  let component: CustomerInfoModelComponent;
  let fixture: ComponentFixture<CustomerInfoModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerInfoModelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInfoModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
