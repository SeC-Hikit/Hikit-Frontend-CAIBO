import { SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapUtils } from '../map-view/MapUtils';
import { TrailCoordinates } from '../TrailCoordinates';
import { UserCoordinates } from '../UserCoordinates';

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.css']
})
export class MapPreviewComponent implements OnInit {

  @Input() trailPreview: TrailCoordinates[];
  @Input() elementAt: UserCoordinates;
  @Input() index: string;

  private map: L.Map;

  private polyline: L.Polyline;
  private marker: L.Marker;
  private selectionCircle: L.Circle;

  constructor() { }

  ngOnInit(): void {
    this.index = this.index ? this.index : "0";
  }

  ngAfterViewInit() {
    let openStreetmapCopy:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    let topoLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: openStreetmapCopy }
    );
    this.initMap(topoLayer, this.index);
  }

  private initMap(topoLayer: L.TileLayer, index: string) {
    this.map = L.map("map-table-" + index, { layers: [topoLayer], maxZoom: 17 });
    this.map.setView(
      [44.498955, 11.327591],
      12
    );
    if(this.trailPreview) { this.onPreview(this.trailPreview); }
    if(this.elementAt) { this.onSelection(this.elementAt); }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isInitialized()) { return; }
    for (const propName in changes) {
      if (propName == "trailPreview") { if (this.trailPreview) { this.onPreview(this.trailPreview) } }
      if (propName == "elementAt") { this.onSelection(this.elementAt) }
    }
  }

  onSelection(userPosition: UserCoordinates) {
    
    if(this.selectionCircle) this.map.removeLayer(this.selectionCircle);
    this.selectionCircle = L.circle([userPosition.latitude, userPosition.longitude],
      { radius: 30, color: 'red' }).addTo(this.map);
    this.map.addLayer(this.selectionCircle);
    this.map.flyTo(this.selectionCircle.getLatLng());
  }

  onPreview(trailPreviewCoordinates: TrailCoordinates[]): void {
    this.clearMap();
    let coordinatesLatLngs = MapUtils.getCoordinatesInverted(trailPreviewCoordinates);
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
