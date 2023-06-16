import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementSingleViewComponent } from './announcement-single-view.component';

describe('AnnouncementSingleViewComponent', () => {
  let component: AnnouncementSingleViewComponent;
  let fixture: ComponentFixture<AnnouncementSingleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementSingleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementSingleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
