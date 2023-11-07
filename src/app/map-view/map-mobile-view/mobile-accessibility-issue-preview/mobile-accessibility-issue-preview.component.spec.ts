import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAccessibilityIssuePreviewComponent } from './mobile-accessibility-issue-preview.component';

describe('MobileAccessibilityIssuePreviewComponent', () => {
  let component: MobileAccessibilityIssuePreviewComponent;
  let fixture: ComponentFixture<MobileAccessibilityIssuePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAccessibilityIssuePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAccessibilityIssuePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
