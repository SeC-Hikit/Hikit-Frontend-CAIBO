import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailRawViewTableComponent } from './trail-raw-view-table.component';

describe('TrailRawViewTableComponent', () => {
  let component: TrailRawViewTableComponent;
  let fixture: ComponentFixture<TrailRawViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailRawViewTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailRawViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
