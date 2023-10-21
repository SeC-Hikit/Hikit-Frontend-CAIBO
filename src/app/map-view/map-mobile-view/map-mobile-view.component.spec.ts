import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMobileViewComponent } from './map-mobile-view.component';

describe('MapMobileViewComponent', () => {
  let component: MapMobileViewComponent;
  let fixture: ComponentFixture<MapMobileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapMobileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
