import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import 'leaflet';
import * as L from 'leaflet-textpath';
import { Trail } from '../Trail';
import { TrailClassification } from '../TrailClassification';
import { MapUtils } from './MapUtils';
import { TrailToPolyline } from './TrailToPolyline';

@Component({
  selector: 'app-map-full',
  templateUrl: './map-full.component.html',
  styleUrls: ['./map-full.component.css']
})
export class MapFullComponent implements OnInit {

  map: L.Map;
  selectedLayer: L.TileLayer;
  selectedTrailLayer: L.Polyline;
  selectedMarkerLayer: L.Marker;

  otherTrailsPolylines: TrailToPolyline[];

  openStreetmapCopy: string;

  @Input() selectedTrail: Trail;
  @Input() trailList: Trail[];
  @Input() tileLayerName: string;

  constructor() { }

  ngOnInit(): void {
    this.openStreetmapCopy =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    this.selectedLayer = this.getLayerByName("topo");
    this.map = L.map("map-full", { layers: [this.selectedLayer], maxZoom: 17 }).setView(
      [44.498955, 11.327591],
      12
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName == "selectedTrail") { this.renderTrail(this.selectedTrail) }
      if (propName == "trailList") { this.renderAllTrail(this.trailList) }
      if (propName == "tileLayerName") { this.renderTileLayer(this.tileLayerName) }
    }
  }

  renderTrail(selectedTrail: Trail) {
    console.log(selectedTrail);
    this.clearPreviouslySelectedLayer();
    this.clearPathFromList(selectedTrail);
    
    let polyline = L.polyline(MapUtils.getCoordinatesInverted(selectedTrail.coordinates));
    polyline.setStyle(this.getLineStyle(true, selectedTrail.classification));
    polyline.setText(MapUtils.generateTextForMap(selectedTrail.code));

    //TODO

  }

  renderAllTrail(trailList: Trail[]) {
    this.otherTrailsPolylines = this.trailList.map(trail => {
      return new TrailToPolyline(trail.code,
        L.polyline(MapUtils.getCoordinatesInverted(trail.coordinates),
          this.getLineStyle(false, trail.classification)))});
    this.otherTrailsPolylines.forEach(trailToPoly=> { trailToPoly.getPolyline().addTo(this.map)});
  }

  renderTileLayer(tileLayerName: string): void {
    this.map.removeLayer(this.selectedLayer);
    this.selectedLayer = this.getLayerByName(tileLayerName);
    this.selectedLayer.addTo(this.map);
  }

  clearPreviouslySelectedLayer() {
    if (this.selectedTrailLayer) this.map.removeLayer(this.selectedTrailLayer);
    if (this.selectedMarkerLayer) this.map.removeLayer(this.selectedMarkerLayer);
  }

  clearPathFromList(selectedTrail: Trail) {
    const trailFromOtherTrails = this.otherTrailsPolylines.filter(x => x.getCode() == selectedTrail.code)[0];
    this.map.removeLayer(trailFromOtherTrails.getPolyline());   
  }

  getLineStyle(isSelectedLine: boolean, trailClassification: TrailClassification): L.PolylineOptions {
    var trailColor = isSelectedLine ? "red" : "#ff1414";
    switch (trailClassification) {
      case TrailClassification.E:
        return {
          weight: MapUtils.LINE_WEIGHT,
          color: trailColor,
          dashArray: "5, 10",
        };
      case TrailClassification.EEA:
        return {
          weight: MapUtils.LINE_WEIGHT,
          color: trailColor,
          dashArray: "2, 10",
        };
      case TrailClassification.EE:
        return {
          weight: MapUtils.LINE_WEIGHT,
          color: trailColor,
          dashArray: "3, 10",
        };
      default:
        return { weight: MapUtils.LINE_WEIGHT, color: trailColor };
    }
  }

  getLayerByName(layerName: string): L.TileLayer {
    switch (layerName) {
      case "topo":
        return L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          { attribution: this.openStreetmapCopy }
        );
      case "geopolitic":
        return L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          { attribution: this.openStreetmapCopy }
        );
      case "geopolitic2":
        return L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          { attribution: this.openStreetmapCopy }
        );
      default:
        throw new Error("TileLayer not in list");
    }
  }


}
