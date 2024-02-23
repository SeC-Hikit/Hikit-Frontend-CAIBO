import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaManagementComponent } from './media-management.component';

describe('MediaManagementComponent', () => {
  let component: MediaManagementComponent;
  let fixture: ComponentFixture<MediaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
