import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-full',
  templateUrl: './map-full.component.html',
  styleUrls: ['./map-full.component.css']
})
export class MapFullComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    let openStreetmapCopy:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    let topoLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: openStreetmapCopy }
    );

    L.map("map-full", { layers: [topoLayer], maxZoom: 17 }).setView(
      [44.498955, 11.327591],
      12
    );
  }

}
