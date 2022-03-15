import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceViewComponent } from './maintenance-view.component';

describe('MaintenanceViewComponent', () => {
  let component: MaintenanceViewComponent;
  let fixture: ComponentFixture<MaintenanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
