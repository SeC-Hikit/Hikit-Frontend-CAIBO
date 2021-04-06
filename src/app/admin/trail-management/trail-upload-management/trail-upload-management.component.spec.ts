import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailUploadManagementComponent } from './trail-upload-management.component';

describe('TrailAddManagementComponent', () => {
  let component: TrailUploadManagementComponent;
  let fixture: ComponentFixture<TrailUploadManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrailUploadManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailUploadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
