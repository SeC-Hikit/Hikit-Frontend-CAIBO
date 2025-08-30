import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapPreviewMunicipalitiesComponent} from './map-preview-municipalities.component';

describe('MapPreviewMunicipalitiesComponent', () => {
  let component: MapPreviewMunicipalitiesComponent;
  let fixture: ComponentFixture<MapPreviewMunicipalitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPreviewMunicipalitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPreviewMunicipalitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
