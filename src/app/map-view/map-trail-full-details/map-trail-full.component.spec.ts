import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrailFullComponent } from './map-trail-full.component';

describe('MapTrailFullComponent', () => {
  let component: MapTrailFullComponent;
  let fixture: ComponentFixture<MapTrailFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTrailFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrailFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
