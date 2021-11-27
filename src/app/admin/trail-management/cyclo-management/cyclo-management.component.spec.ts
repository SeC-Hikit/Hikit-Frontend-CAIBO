import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycloManagementComponent } from './cyclo-management.component';

describe('CycloManagementComponent', () => {
  let component: CycloManagementComponent;
  let fixture: ComponentFixture<CycloManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycloManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CycloManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
