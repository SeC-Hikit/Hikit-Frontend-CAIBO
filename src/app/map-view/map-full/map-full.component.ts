import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import 'leaflet';
import 'leaflet-textpath';
import { Trail } from 'src/app/Trail';
import { TrailClassification } from 'src/app/TrailClassification';
import { MapUtils } from '../MapUtils';
import { TrailToPolyline } from '../TrailToPolyline';
declare let L; // to be able to use L namespace

@Component({
  selector: 'app-map-full',
  templateUrl: './map-full.component.html',
  styleUrls: ['./map-full.component.css']
})
export class MapFullComponent implements OnInit {

  private static MAP_ID: string = "map-full"
  
  map: L.Map;
  selectedLayer: L.TileLayer;
  selectedTrailLayer: L.Polyline;
  selectedMarkerLayer: L.Marker;

  otherTrailsPolylines: TrailToPolyline[];

  openStreetmapCopy: string;

  @Input() selectedTrail: Trail;
  @Input() trailList: Trail[];
  @Input() tileLayerName: string;

  @Output() selectCodeEvent = new EventEmitter<string>();

  @ViewChild("#map-full") mapObj;


  constructor() {
    this.otherTrailsPolylines = [];
  }


  ngOnInit(): void {
    this.openStreetmapCopy =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    this.selectedLayer = this.getLayerByName("topo");
    this.map = L.map(MapFullComponent.MAP_ID, { layers: [this.selectedLayer], maxZoom: 17 }).setView(
      [44.498955, 11.327591],
      12
    );
  }

  ngAfterViewInit(): void {
    let documentHeight: number = document.documentElement.scrollHeight;
    let headerWrapperHeight = document.getElementById("header-wrapper").offsetHeight;
    let slimHeaderWrapHeight = document.getElementById("header-slim-wrapper").offsetHeight;
    let mapHeight = documentHeight - headerWrapperHeight - slimHeaderWrapHeight;
    console.log(documentHeight);
    document.getElementById(MapFullComponent.MAP_ID).style.height = mapHeight.toString() + "px";
    this.map.invalidateSize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isInitialized()) {
      for (const propName in changes) {
        if (propName == "tileLayerName") { this.renderTileLayer(this.tileLayerName) }
        if (propName == "trailList") { this.renderAllTrail(this.trailList) }
        if (propName == "selectedTrail") { this.renderTrail(this.selectedTrail) }
      }
    }
  }

  renderTrail(selectedTrail: Trail) {
    this.clearPreviouslySelectedLayer();
    this.clearPathFromList(selectedTrail);
    let polyline = L.polyline(MapUtils.getCoordinatesInverted(selectedTrail.coordinates));
    polyline.setStyle(this.getLineStyle(true, selectedTrail.classification));
    polyline.setText(MapUtils.generateTextForMap(selectedTrail.code), MapUtils.getTextSyle(true));
    polyline.bindPopup(selectedTrail.code);
    polyline.addTo(this.map);
    this.map.fitBounds(polyline.getBounds());
  }

  renderAllTrail(trailList: Trail[]) {
    this.otherTrailsPolylines = trailList.map(trail => {
      return new TrailToPolyline(trail.code,
        L.polyline(MapUtils.getCoordinatesInverted(trail.coordinates),
          this.getLineStyle(false, trail.classification)))
    });
    this.otherTrailsPolylines.forEach(trailToPoly => {
      trailToPoly.getPolyline().addTo(this.map)
      trailToPoly.getPolyline().on("click", this.onSelectTrail(trailToPoly));
    });
  }

  private onSelectTrail(trailToPoly: TrailToPolyline) {
    let codeEmitter = this.selectCodeEvent;
    return function () {
      codeEmitter.emit(trailToPoly.getCode())
    };
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
    const trailFromOtherTrails = this.otherTrailsPolylines.filter(x => x.getCode() == selectedTrail.code);
    if (trailFromOtherTrails && trailFromOtherTrails.length > 0) {
      this.map.removeLayer(trailFromOtherTrails[0].getPolyline());
    }
  }

  getLineStyle(isSelectedLine: boolean, trailClassification: TrailClassification) {
    var trailColor = MapUtils.getLineColor(isSelectedLine);
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

  isInitialized(): boolean {
    return this.map != null;
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
