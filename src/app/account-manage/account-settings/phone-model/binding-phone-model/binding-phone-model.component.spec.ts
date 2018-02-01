/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BindingPhoneModelComponent } from './binding-phone-model.component';

describe('BindingPhoneModelComponent', () => {
  let component: BindingPhoneModelComponent;
  let fixture: ComponentFixture<BindingPhoneModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindingPhoneModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindingPhoneModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
