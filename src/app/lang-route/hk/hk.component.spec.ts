/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HkComponent } from './hk.component';

describe('HkComponent', () => {
  let component: HkComponent;
  let fixture: ComponentFixture<HkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
