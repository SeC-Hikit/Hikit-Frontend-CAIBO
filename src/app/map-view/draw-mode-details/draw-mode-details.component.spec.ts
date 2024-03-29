import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DrawModeDetailsComponent} from './draw-mode-details.component';

describe('DrawModeDetailsComponent', () => {
  let component: DrawModeDetailsComponent;
  let fixture: ComponentFixture<DrawModeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawModeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawModeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
