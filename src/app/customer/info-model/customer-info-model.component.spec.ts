/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { CustomerForEditModelComponent } from './customer-info-model.component';
import { DebugElement } from '@angular/core';

describe('CustomerForEditModelComponent', () => {
  let component: CustomerForEditModelComponent;
  let fixture: ComponentFixture<CustomerForEditModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerForEditModelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerForEditModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
