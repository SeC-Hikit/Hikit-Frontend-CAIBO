import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailDetailPageComponent } from './trail-detail-page.component';

describe('TrailDetailPageComponent', () => {
  let component: TrailDetailPageComponent;
  let fixture: ComponentFixture<TrailDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
