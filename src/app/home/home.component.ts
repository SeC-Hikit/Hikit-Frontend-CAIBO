import { Component, OnInit } from '@angular/core';
import { GraphicUtils } from '../utils/GraphicUtils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  static HOME_ID : string = "image";

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let menuHeight = GraphicUtils.getMenuHeight();
    let fullSizeWOBorder = GraphicUtils.getFullHeightSizeWOMenuImage();
    document.getElementById(HomeComponent.HOME_ID).style.minHeight = fullSizeWOBorder.toString() + "px";
    document.getElementById("holder").style.minHeight = (fullSizeWOBorder - menuHeight) .toString() + "px";
  }
  
}
