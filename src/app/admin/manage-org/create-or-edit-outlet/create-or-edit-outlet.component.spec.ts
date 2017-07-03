import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditOutletComponent } from './create-or-edit-outlet.component';

describe('CreateOrEditOutletComponent', () => {
  let component: CreateOrEditOutletComponent;
  let fixture: ComponentFixture<CreateOrEditOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrEditOutletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
