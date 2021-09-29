import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiViewTableComponent } from './poi-view-table.component';

describe('PoiViewTableComponent', () => {
  let component: PoiViewTableComponent;
  let fixture: ComponentFixture<PoiViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoiViewTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiViewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
