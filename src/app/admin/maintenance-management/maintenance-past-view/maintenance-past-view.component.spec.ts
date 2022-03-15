import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePastViewComponent } from './maintenance-past-view.component';

describe('MaintenancePastViewComponent', () => {
  let component: MaintenancePastViewComponent;
  let fixture: ComponentFixture<MaintenancePastViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenancePastViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePastViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
