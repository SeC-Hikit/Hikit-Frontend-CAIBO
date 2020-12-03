import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityManagementComponent } from './accessibility-management.component';

describe('AccessibilityManagementComponent', () => {
  let component: AccessibilityManagementComponent;
  let fixture: ComponentFixture<AccessibilityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
