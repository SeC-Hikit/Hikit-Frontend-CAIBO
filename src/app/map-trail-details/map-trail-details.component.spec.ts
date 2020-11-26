import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrailDetailsComponent } from './map-trail-details.component';

describe('MapTrailDetailsComponent', () => {
  let component: MapTrailDetailsComponent;
  let fixture: ComponentFixture<MapTrailDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTrailDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
