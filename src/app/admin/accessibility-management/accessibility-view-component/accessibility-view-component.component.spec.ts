import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityViewComponentComponent } from './accessibility-view-component.component';

describe('AccessibilityViewComponentComponent', () => {
  let component: AccessibilityViewComponentComponent;
  let fixture: ComponentFixture<AccessibilityViewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityViewComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityViewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
