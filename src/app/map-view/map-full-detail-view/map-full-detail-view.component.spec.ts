import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFullDetailViewComponent } from './map-full-detail-view.component';

describe('MapFullDetailViewComponent', () => {
  let component: MapFullDetailViewComponent;
  let fixture: ComponentFixture<MapFullDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapFullDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFullDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
