import { SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapUtils } from '../map-full/MapUtils';
import { Trail } from '../Trail';

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.css']
})
export class MapPreviewComponent implements OnInit {

  @Input() trailPreview: Trail;

  private map: L.Map

  private polyline: L.Polyline
  private marker: L.Marker


  constructor() { }

  ngOnInit(): void {
    let openStreetmapCopy:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    let topoLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: openStreetmapCopy }
    );

    this.initMap(topoLayer);
  }

  private initMap(topoLayer: L.TileLayer) {
    this.map = L.map("map-table", { layers: [topoLayer], maxZoom: 17 });
    this.map.setView(
      [44.498955, 11.327591],
      12
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.isInitialized()) { return; }
    for (const propName in changes) {
      if (propName == "trailPreview") { this.onPreview(this.trailPreview) }
    }
  }

  onPreview(trailPreview: Trail): void {
    this.clearMap();
    let coordinatesLatLngs = MapUtils.getCoordinatesInverted(this.trailPreview.coordinates);
    this.polyline = L.polyline(coordinatesLatLngs, {
      color: "red"
    });
    this.polyline.addTo(this.map);
    this.marker = L.marker(coordinatesLatLngs[0]);
    this.marker = L.marker(coordinatesLatLngs[coordinatesLatLngs.length - 1]);
    this.marker.addTo(this.map);
    this.map.fitBounds(this.polyline.getBounds());
  }

  clearMap(): void {
    if (this.polyline != null) { this.map.removeLayer(this.polyline) };
    if (this.marker != null) { this.map.removeLayer(this.marker) };
  }

  isInitialized(): boolean {
    return this.map != null;
  }

}
