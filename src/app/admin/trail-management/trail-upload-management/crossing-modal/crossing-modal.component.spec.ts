import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossingModalComponent } from './crossing-modal.component';

describe('CrossingModalComponent', () => {
  let component: CrossingModalComponent;
  let fixture: ComponentFixture<CrossingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
