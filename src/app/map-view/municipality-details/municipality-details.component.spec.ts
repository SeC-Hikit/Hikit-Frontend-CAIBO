import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalityDetailsComponent } from './municipality-details.component';

describe('MunicipalityDetailsComponent', () => {
  let component: MunicipalityDetailsComponent;
  let fixture: ComponentFixture<MunicipalityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunicipalityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
