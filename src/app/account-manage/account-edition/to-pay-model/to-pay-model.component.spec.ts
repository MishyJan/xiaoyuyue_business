/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ToPayModelComponent } from 'app/account-manage/account-edition/to-pay-model/to-pay-model.component';


describe('ToPayModelComponent', () => {
  let component: ToPayModelComponent;
  let fixture: ComponentFixture<ToPayModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToPayModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToPayModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
