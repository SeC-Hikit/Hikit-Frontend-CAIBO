import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceManagementComponent } from './maintenance-management.component';

describe('MaintenanceManagementComponent', () => {
  let component: MaintenanceManagementComponent;
  let fixture: ComponentFixture<MaintenanceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
