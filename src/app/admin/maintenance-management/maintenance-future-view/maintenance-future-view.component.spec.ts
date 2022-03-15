import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceFutureViewComponent } from './maintenance-future-view.component';

describe('MaintenanceFutureViewComponent', () => {
  let component: MaintenanceFutureViewComponent;
  let fixture: ComponentFixture<MaintenanceFutureViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceFutureViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceFutureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
