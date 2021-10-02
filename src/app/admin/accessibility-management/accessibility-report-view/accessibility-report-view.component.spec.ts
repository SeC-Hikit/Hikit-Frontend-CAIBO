import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityReportViewComponent } from './accessibility-report-view.component';

describe('AccessibilityReportViewComponent', () => {
  let component: AccessibilityReportViewComponent;
  let fixture: ComponentFixture<AccessibilityReportViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityReportViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
