import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingOnPositionComponent } from './reporting-on-position.component';

describe('ReportingOnPositionComponent', () => {
  let component: ReportingOnPositionComponent;
  let fixture: ComponentFixture<ReportingOnPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportingOnPositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingOnPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
