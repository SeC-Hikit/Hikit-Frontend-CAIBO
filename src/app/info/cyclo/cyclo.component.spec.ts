import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycloComponent } from './cyclo.component';

describe('CycloComponent', () => {
  let component: CycloComponent;
  let fixture: ComponentFixture<CycloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CycloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
