import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePlacePreviewComponent } from './mobile-place-preview.component';

describe('MobilePlacePreviewComponent', () => {
  let component: MobilePlacePreviewComponent;
  let fixture: ComponentFixture<MobilePlacePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilePlacePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilePlacePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
