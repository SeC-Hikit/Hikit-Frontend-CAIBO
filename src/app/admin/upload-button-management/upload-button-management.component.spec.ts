import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadButtonManagementComponent } from './upload-button-management.component';

describe('UploadButtonManagementComponent', () => {
  let component: UploadButtonManagementComponent;
  let fixture: ComponentFixture<UploadButtonManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadButtonManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadButtonManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
