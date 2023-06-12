import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementEditComponent } from './announcement-edit.component';

describe('AnnouncementEditComponent', () => {
  let component: AnnouncementEditComponent;
  let fixture: ComponentFixture<AnnouncementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
