import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacePickerSelectorComponent } from './place-picker-selector.component';

describe('PlacePickerSelectorComponent', () => {
  let component: PlacePickerSelectorComponent;
  let fixture: ComponentFixture<PlacePickerSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacePickerSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacePickerSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
