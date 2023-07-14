import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionModalComponent } from './option-modal.component';

describe('OptionModalComponent', () => {
  let component: OptionModalComponent;
  let fixture: ComponentFixture<OptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
