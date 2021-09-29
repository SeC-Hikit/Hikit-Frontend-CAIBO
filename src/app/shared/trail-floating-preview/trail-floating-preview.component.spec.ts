import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailFloatingPreviewComponent } from './trail-floating-preview.component';

describe('TrailFloatingPreviewComponent', () => {
  let component: TrailFloatingPreviewComponent;
  let fixture: ComponentFixture<TrailFloatingPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailFloatingPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailFloatingPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
