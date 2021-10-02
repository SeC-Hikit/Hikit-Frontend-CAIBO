import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityViewComponent } from './accessibility-view.component';

describe('AccessibilityViewComponent', () => {
  let component: AccessibilityViewComponent;
  let fixture: ComponentFixture<AccessibilityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
