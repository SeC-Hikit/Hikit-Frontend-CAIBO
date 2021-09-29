import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoiAddComponent } from './poi-add.component';

describe('PoiAddComponent', () => {
  let component: PoiAddComponent;
  let fixture: ComponentFixture<PoiAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoiAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoiAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
