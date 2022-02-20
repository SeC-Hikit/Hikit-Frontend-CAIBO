import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailModifyManagementComponent } from './trail-modify-management.component';

describe('TrailModifyManagementComponent', () => {
  let component: TrailModifyManagementComponent;
  let fixture: ComponentFixture<TrailModifyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailModifyManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailModifyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
