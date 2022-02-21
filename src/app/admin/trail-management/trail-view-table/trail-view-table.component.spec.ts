import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailViewTableComponent } from './trail-view-table.component';

describe('TrailViewTableComponent', () => {
  let component: TrailViewTableComponent;
  let fixture: ComponentFixture<TrailViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailViewTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
