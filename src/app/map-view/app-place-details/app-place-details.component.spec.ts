import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPlaceDetailsComponent } from './app-place-details.component';

describe('AppPlaceDetailsComponent', () => {
  let component: AppPlaceDetailsComponent;
  let fixture: ComponentFixture<AppPlaceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPlaceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPlaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
