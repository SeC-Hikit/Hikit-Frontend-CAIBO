import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceViewTableComponent } from './place-view-table.component';

describe('PlaceViewTableComponent', () => {
  let component: PlaceViewTableComponent;
  let fixture: ComponentFixture<PlaceViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceViewTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
