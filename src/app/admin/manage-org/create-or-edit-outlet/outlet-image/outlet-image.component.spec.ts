import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletImageComponent } from './outlet-image.component';

describe('OutletImageComponent', () => {
  let component: OutletImageComponent;
  let fixture: ComponentFixture<OutletImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
