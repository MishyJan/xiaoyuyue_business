/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UnbindingEmailModelComponent } from 'app/account-settings/email-model/unbinding-email-model/unbinding-email-model.component';

describe('UnbindingEmailModelComponent', () => {
  let component: UnbindingEmailModelComponent;
  let fixture: ComponentFixture<UnbindingEmailModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnbindingEmailModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnbindingEmailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
