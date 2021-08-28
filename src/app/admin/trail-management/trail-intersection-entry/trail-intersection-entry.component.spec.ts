import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailIntersectionEntryComponent } from './trail-intersection-entry.component';

describe('TrailIntersectionEntryComponent', () => {
  let component: TrailIntersectionEntryComponent;
  let fixture: ComponentFixture<TrailIntersectionEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailIntersectionEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailIntersectionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
