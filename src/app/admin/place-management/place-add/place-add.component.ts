import {Component, OnInit} from '@angular/core';
import {Coordinates2D} from "../../../service/geo-trail-service";
import {Marker} from "../../../map-preview/map-preview.component";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";

@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.component.html',
  styleUrls: ['./place-add.component.scss']
})
export class PlaceAddComponent implements OnInit {

  errors = [];
  markers: Marker[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onMapClick(coords: Coordinates2D) {
    this.markers = [{
      icon: MapPinIconType.PIN,
      coords: coords,
      color: "#1D9566"
    }]
  }


}
