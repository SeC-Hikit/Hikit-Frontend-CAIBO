import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailAddManagementComponent } from './trail-add-management.component';

describe('TrailAddManagementComponent', () => {
  let component: TrailAddManagementComponent;
  let fixture: ComponentFixture<TrailAddManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailAddManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailAddManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
