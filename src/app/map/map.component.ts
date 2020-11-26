import { Component, OnInit } from '@angular/core';
import { Trail } from '../Trail';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  selectedTrail : Trail

  constructor() { }

  ngOnInit(): void {
  }

  changeTileLayer(type: String) : void { 
    
  }

}
