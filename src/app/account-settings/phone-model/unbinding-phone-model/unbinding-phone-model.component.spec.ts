/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnbindingPhoneModelComponent } from './unbinding-phone-model.component';

describe('UnbindingPhoneModelComponent', () => {
  let component: UnbindingPhoneModelComponent;
  let fixture: ComponentFixture<UnbindingPhoneModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnbindingPhoneModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnbindingPhoneModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
