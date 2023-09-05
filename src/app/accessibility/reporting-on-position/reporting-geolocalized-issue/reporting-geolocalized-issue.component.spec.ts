import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingGeolocalizedIssueComponent } from './reporting-geolocalized-issue.component';

describe('ReportingGeolocalizedIssueComponent', () => {
  let component: ReportingGeolocalizedIssueComponent;
  let fixture: ComponentFixture<ReportingGeolocalizedIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingGeolocalizedIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingGeolocalizedIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
