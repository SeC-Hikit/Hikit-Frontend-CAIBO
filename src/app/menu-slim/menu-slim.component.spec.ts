import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSlimComponent } from './menu-slim.component';

describe('MenuSlimComponent', () => {
  let component: MenuSlimComponent;
  let fixture: ComponentFixture<MenuSlimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSlimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSlimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
