import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityAddComponent } from './accessibility-add.component';

describe('AccessibilityAddComponent', () => {
  let component: AccessibilityAddComponent;
  let fixture: ComponentFixture<AccessibilityAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessibilityAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
