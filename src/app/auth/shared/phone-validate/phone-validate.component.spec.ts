import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneValidateComponent } from './phone-validate.component';

describe('PhoneValidateComponent', () => {
  let component: PhoneValidateComponent;
  let fixture: ComponentFixture<PhoneValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
