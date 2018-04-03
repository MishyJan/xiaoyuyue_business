/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BindingEmailModelComponent } from 'app/account-manage/account-settings/email-model/binding-email-model/binding-email-model.component';

describe('BindingEmailModelComponent', () => {
  let component: BindingEmailModelComponent;
  let fixture: ComponentFixture<BindingEmailModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindingEmailModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindingEmailModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
