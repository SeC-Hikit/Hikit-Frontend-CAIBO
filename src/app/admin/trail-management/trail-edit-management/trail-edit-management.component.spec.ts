import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailEditManagementComponent } from './trail-edit-management.component';

describe('TrailEditManagementComponent', () => {
  let component: TrailEditManagementComponent;
  let fixture: ComponentFixture<TrailEditManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailEditManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailEditManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
