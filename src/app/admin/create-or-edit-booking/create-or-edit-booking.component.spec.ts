import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOrEditBookingComponent } from "app/admin/create-or-edit-booking/create-or-edit-booking.component";


describe('CreateYuyueComponent', () => {
  let component: CreateOrEditBookingComponent;
  let fixture: ComponentFixture<CreateOrEditBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrEditBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
