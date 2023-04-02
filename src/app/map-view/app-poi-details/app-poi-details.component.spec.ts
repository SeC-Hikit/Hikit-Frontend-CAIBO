import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPoiDetailsComponent } from './app-poi-details.component';

describe('AppPoiDetailsComponent', () => {
  let component: AppPoiDetailsComponent;
  let fixture: ComponentFixture<AppPoiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPoiDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPoiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
