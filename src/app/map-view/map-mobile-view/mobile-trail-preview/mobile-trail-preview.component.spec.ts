import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTrailPreviewComponent } from './mobile-trail-preview.component';

describe('MobileTrailPreviewComponent', () => {
  let component: MobileTrailPreviewComponent;
  let fixture: ComponentFixture<MobileTrailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTrailPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTrailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
