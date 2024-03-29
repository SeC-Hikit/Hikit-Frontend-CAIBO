import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DrawModePreviewComponent} from './draw-mode-preview.component';

describe('DrawModePreviewComponent', () => {
  let component: DrawModePreviewComponent;
  let fixture: ComponentFixture<DrawModePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawModePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawModePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
