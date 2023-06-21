import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportingComponent } from './bug-reporting.component';

describe('BugReportingComponent', () => {
  let component: BugReportingComponent;
  let fixture: ComponentFixture<BugReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugReportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
