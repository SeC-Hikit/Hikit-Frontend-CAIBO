import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailConfirmModalComponent } from './trail-confirm-modal.component';

describe('TrailConfirmModalComponent', () => {
  let component: TrailConfirmModalComponent;
  let fixture: ComponentFixture<TrailConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
