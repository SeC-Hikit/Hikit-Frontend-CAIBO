import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTrailListComponent } from './map-trail-list.component';

describe('MapTrailListComponent', () => {
  let component: MapTrailListComponent;
  let fixture: ComponentFixture<MapTrailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTrailListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTrailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
