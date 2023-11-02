import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePoiPreviewComponent } from './mobile-poi-preview.component';

describe('MobilePoiPreviewComponent', () => {
  let component: MobilePoiPreviewComponent;
  let fixture: ComponentFixture<MobilePoiPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilePoiPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilePoiPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
