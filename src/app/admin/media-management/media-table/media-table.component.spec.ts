import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaTableComponent} from './media-table.component';

describe('MediaTableComponent', () => {
  let component: MediaTableComponent;
  let fixture: ComponentFixture<MediaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
