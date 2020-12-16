import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAddComponent } from './maintenance-add.component';

describe('MaintenanceAddComponent', () => {
  let component: MaintenanceAddComponent;
  let fixture: ComponentFixture<MaintenanceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
