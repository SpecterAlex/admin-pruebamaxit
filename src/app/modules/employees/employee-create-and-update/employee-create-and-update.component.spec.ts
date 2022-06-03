import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreateAndUpdateComponent } from './employee-create-and-update.component';

describe('EmployeeCreateAndUpdateComponent', () => {
  let component: EmployeeCreateAndUpdateComponent;
  let fixture: ComponentFixture<EmployeeCreateAndUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCreateAndUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCreateAndUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
