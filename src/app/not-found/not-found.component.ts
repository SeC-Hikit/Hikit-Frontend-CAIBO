import { Component, OnInit } from '@angular/core';
import { GraphicUtils } from '../utils/GraphicUtils';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let fullSizeWBorder = GraphicUtils.getFullHeightSizeMenu();
    let fullSizeWOBorder = GraphicUtils.getFullHeightSizeWOMenu();
    document.getElementsByTagName("body")[0].style.backgroundColor = "#68C2C2";
    // document.getElementById("holder").style.minHeight = fullSizeWBorder.toString() + "px";
  }

  ngOnDestroy(): void {
    document.getElementsByTagName("body")[0].style.backgroundColor = "white";
  }

}
