import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailManagementComponent } from './trail-management.component';

describe('PoiManagementComponent', () => {
  let component: TrailManagementComponent;
  let fixture: ComponentFixture<TrailManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
