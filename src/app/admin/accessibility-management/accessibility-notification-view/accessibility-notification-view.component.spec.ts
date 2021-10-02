import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityNotificationViewComponent } from './accessibility-notification-view.component';

describe('AccessibilityNotificationViewComponent', () => {
  let component: AccessibilityNotificationViewComponent;
  let fixture: ComponentFixture<AccessibilityNotificationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityNotificationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityNotificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
