/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MobileConfirmOrderModelComponent } from './mobile-confirm-order-model.component';

describe('MobileConfirmOrderModelComponent', () => {
  let component: MobileConfirmOrderModelComponent;
  let fixture: ComponentFixture<MobileConfirmOrderModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileConfirmOrderModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileConfirmOrderModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
