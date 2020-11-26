import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFullComponent } from './map-full.component';

describe('MapFullComponent', () => {
  let component: MapFullComponent;
  let fixture: ComponentFixture<MapFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
