import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementViewComponent } from './announcement-view.component';

describe('AnnouncementViewComponent', () => {
  let component: AnnouncementViewComponent;
  let fixture: ComponentFixture<AnnouncementViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
