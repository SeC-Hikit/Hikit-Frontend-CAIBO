import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailDetailsComponent } from './trail-details.component';

describe('MapTrailDetailsComponent', () => {
  let component: TrailDetailsComponent;
  let fixture: ComponentFixture<TrailDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
