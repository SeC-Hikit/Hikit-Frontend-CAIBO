import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailRawManagementComponent } from './trail-raw-management.component';

describe('TrailRawManagementComponent', () => {
  let component: TrailRawManagementComponent;
  let fixture: ComponentFixture<TrailRawManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailRawManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailRawManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
