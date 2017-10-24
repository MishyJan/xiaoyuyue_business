/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SupportedBrowsersComponent } from './supported-browsers.component';

describe('SupportedBrowsersComponent', () => {
  let component: SupportedBrowsersComponent;
  let fixture: ComponentFixture<SupportedBrowsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportedBrowsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportedBrowsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
