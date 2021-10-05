import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEntryReportComponent } from './location-entry.component';

describe('LocationEntryReportComponent', () => {
  let component: LocationEntryReportComponent;
  let fixture: ComponentFixture<LocationEntryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationEntryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationEntryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
