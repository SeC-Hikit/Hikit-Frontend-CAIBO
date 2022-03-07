import { Component, OnInit } from "@angular/core";

export enum TabType {
  TRAILS = "trails",
  ACCESSIBILITY = "tracks",
  MAINTENANCE = "maintenance",
}

interface Tab {
  code: string;
  label: string;
}

export const tabsList: Tab[] = [
  {
    id: "trails",
    label: "Sentieri",
  },
  {
    id: "tracks",
    label: "tracce",
  },
  {
    id: "maintenance",
    label: "Calendario manuntenzioni",
  },
];

@Component({
  selector: "app-menu-management",
  templateUrl: "./menu-management.component.html",
  styleUrls: ["./menu-management.component.scss"],
})
export class MenuManagementComponent implements OnInit {
  selectedTab: string;
  tabType = TabType;
  

  constructor() {}

  switchTab(tab: string): void {
    this.selectedTab = tab;
  }

  ngOnInit(): void {
    this.selectedTab = this.tabType.TRAILS;
    
  }
}
