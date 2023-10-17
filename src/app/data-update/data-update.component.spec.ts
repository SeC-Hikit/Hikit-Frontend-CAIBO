import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUpdateComponent } from './data-update.component';

describe('DataUpdateComponent', () => {
  let component: DataUpdateComponent;
  let fixture: ComponentFixture<DataUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
