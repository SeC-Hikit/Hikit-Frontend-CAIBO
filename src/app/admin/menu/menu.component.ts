import { Component, OnInit } from '@angular/core';

export enum TabType {
  'trail',
  'maintenance',
  'accessibility',
}

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class AdminMenuComponent implements OnInit {
  tabType = TabType;

  constructor() {}

  ngOnInit(): void {}
}
