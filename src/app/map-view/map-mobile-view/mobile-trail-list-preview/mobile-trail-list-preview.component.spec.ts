import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTrailListPreviewComponent } from './mobile-trail-list-preview.component';

describe('MobileTrailListPreviewComponent', () => {
  let component: MobileTrailListPreviewComponent;
  let fixture: ComponentFixture<MobileTrailListPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileTrailListPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTrailListPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
