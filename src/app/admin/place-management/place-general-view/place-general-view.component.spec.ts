import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceGeneralViewComponent } from './place-general-view.component';

describe('GeneralViewComponent', () => {
  let component: PlaceGeneralViewComponent;
  let fixture: ComponentFixture<PlaceGeneralViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceGeneralViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceGeneralViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
