import { Component, OnInit } from '@angular/core';
import { GraphicUtils } from '../utils/GraphicUtils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  static HOME_ID : string = "image";

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let fullSizeWBorder = GraphicUtils.getFullHeightSizeMenu();
    let fullSizeWOBorder = GraphicUtils.getFullHeightSizeWOMenu();
    document.getElementById(HomeComponent.HOME_ID).style.minHeight = fullSizeWOBorder.toString() + "px";
    document.getElementById("holder").style.minHeight = fullSizeWBorder.toString() + "px";
  }
  
}
