import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MobileMunicipalityPreviewComponent} from './mobile-municipality-preview.component';

describe('MobileMunicipalityPreviewComponent', () => {
  let component: MobileMunicipalityPreviewComponent;
  let fixture: ComponentFixture<MobileMunicipalityPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileMunicipalityPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMunicipalityPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
