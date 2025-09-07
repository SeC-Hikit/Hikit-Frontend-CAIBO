import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaAssignerComponent} from './media-assigner.component';

describe('MediaAssignerComponent', () => {
  let component: MediaAssignerComponent;
  let fixture: ComponentFixture<MediaAssignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaAssignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaAssignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
