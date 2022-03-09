import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageSuccessComponent } from './landing-page-success.component';

describe('LandingPageSuccessComponent', () => {
  let component: LandingPageSuccessComponent;
  let fixture: ComponentFixture<LandingPageSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
