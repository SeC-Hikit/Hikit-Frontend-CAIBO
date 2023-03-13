import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCrosswayViewComponent } from './auto-crossway-view.component';

describe('AutoCrosswayViewComponent', () => {
  let component: AutoCrosswayViewComponent;
  let fixture: ComponentFixture<AutoCrosswayViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoCrosswayViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCrosswayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
