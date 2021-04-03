import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import 'leaflet';
import { LeafletMouseEventHandlerFn } from 'leaflet';
import 'leaflet-textpath';
import { Trail, TrailCoordinates } from 'src/app/trail-service.service';
import { UserCoordinates } from 'src/app/UserCoordinates';
import { GraphicUtils } from 'src/app/utils/GraphicUtils';
import { MapUtils } from '../MapUtils';
import { TrailToPolyline } from '../TrailToPolyline';
declare let L; // to be able to use L namespace

@Component({
  selector: 'app-map-full',
  templateUrl: './map-full.component.html',
  styleUrls: ['./map-full.component.scss']
})
export class MapFullComponent implements OnInit {

  private static MAP_ID: string = "map-full"

  map: L.Map;
  selectedLayer: L.TileLayer;
  selectedTrailLayer: L.Polyline;
  selectedMarkerLayer: L.Marker;

  otherTrailsPolylines: TrailToPolyline[];

  openStreetmapCopy: string;

  @Input() userPosition: UserCoordinates;
  @Input() selectedTrail: Trail;
  @Input() trailList: Trail[];
  @Input() tileLayerName: string;
  @Input() highlightedLocation: TrailCoordinates;

  @Output() selectCodeEvent = new EventEmitter<string>();

  constructor() {
    this.otherTrailsPolylines = [];
  }


  ngOnInit(): void {
    this.openStreetmapCopy =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    this.selectedLayer = this.getLayerByName("topo");
    this.selectedLayer.on("load", function () {
      console.log("loaded");
    })
    this.map = L.map(MapFullComponent.MAP_ID, { layers: [this.selectedLayer], maxZoom: 17 }).setView(
      [44.498955, 11.327591],
      12
    );
    L.control.scale({ position: 'topright' }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    let mapHeight = GraphicUtils.getFullHeightSizeMenu();
    document.getElementById(MapFullComponent.MAP_ID).style.height = mapHeight.toString() + "px";
    console.log(mapHeight)
    this.map.invalidateSize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isInitialized()) {
      for (const propName in changes) {
        if (propName == "tileLayerName") { this.renderTileLayer(this.tileLayerName) }
        if (propName == "trailList") { this.renderAllTrail(this.trailList) }
        if (propName == "selectedTrail") { this.renderTrail(this.selectedTrail) }
        if (propName == "userPosition") { this.focusOnUser(this.userPosition) }
        if (propName == "highlightedLocation") { this.focusOnLocation(this.highlightedLocation) }
      }
    }
  }

  focusOnLocation(highlightedLocation: TrailCoordinates) {
    this.map.flyTo([highlightedLocation.latitude, highlightedLocation.longitude]);
  }

  focusOnUser(userPosition: UserCoordinates) {
    // TODO shall be removed on update
    const circle = L.circle([userPosition.latitude, userPosition.longitude],
      { radius: 30, color: 'blue' }).addTo(this.map);
    circle.bindTooltip("Posizione attuale").openTooltip();
    this.map.addLayer(circle);
    this.map.flyTo(circle.getLatLng());
  }

  renderTrail(selectedTrail: Trail) {
    // Shall take the polyline from the full list - do not instantiate a new polyline each tim
    // USE restorePathFromList(x);
    this.clearPreviouslySelectedLayer();
    this.clearPathFromList(selectedTrail);
    let polyline = L.polyline(MapUtils.getCoordinatesInverted(selectedTrail.coordinates));
    polyline.setStyle(MapUtils.getLineStyle(true, selectedTrail.classification));
    polyline.setText(MapUtils.generateTextForMap(selectedTrail.code), MapUtils.getTextSyle(true));
    polyline.bindPopup(selectedTrail.code);
    polyline.addTo(this.map);
    this.map.fitBounds(polyline.getBounds());
  }

  renderAllTrail(trailList: Trail[]) {
    this.otherTrailsPolylines = trailList.map(trail => {
      return new TrailToPolyline(trail.code,
        trail.classification,
        L.polyline(MapUtils.getCoordinatesInverted(trail.coordinates),
          MapUtils.getLineStyle(false, trail.classification)))
    });
    this.otherTrailsPolylines.forEach(trailToPoly => {
      trailToPoly.getPolyline().addTo(this.map)
      trailToPoly.getPolyline().on("click", this.onSelectTrail(trailToPoly));
      trailToPoly.getPolyline().on("mouseover", this.highlightTrail(trailToPoly));
      trailToPoly.getPolyline().on("mouseout", this.dehighlightTrail(trailToPoly));
    });
  }

  dehighlightTrail(trailToPoly: TrailToPolyline): LeafletMouseEventHandlerFn {
    return function () {
      console.log(trailToPoly.getCode());
      trailToPoly.getPolyline().setStyle(
        MapUtils.getLineStyle(false, trailToPoly.getClassification()));
    }
  }

  highlightTrail(trailToPoly: TrailToPolyline): LeafletMouseEventHandlerFn {
    return function () {
      trailToPoly.getPolyline().setStyle({
        color: 'yellow',
        opacity: 3,
        weight: 5
      });
    }
  }

  onSelectTrail(trailToPoly: TrailToPolyline) {
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
    // TODO shall remove previously highlighted line
    if (this.selectedTrailLayer) { this.map.removeLayer(this.selectedTrailLayer); }
    if (this.selectedMarkerLayer) this.map.removeLayer(this.selectedMarkerLayer);
  }

  restorePathFromList(unselectedTrail: Trail) {
    const trailFromOtherTrails = this.otherTrailsPolylines.filter(x => x.getCode() == unselectedTrail.code);
    if (trailFromOtherTrails && trailFromOtherTrails.length > 0) {
      this.map.addLayer(trailFromOtherTrails[0].getPolyline());
    }
  }

  clearPathFromList(selectedTrail: Trail) {
    const trailFromOtherTrails = this.otherTrailsPolylines.filter(x => x.getCode() == selectedTrail.code);
    if (trailFromOtherTrails && trailFromOtherTrails.length > 0) {
      this.map.removeLayer(trailFromOtherTrails[0].getPolyline());
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
