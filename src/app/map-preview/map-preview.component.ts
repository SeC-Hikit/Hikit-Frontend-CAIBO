import { SimpleChanges } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import * as L from "leaflet";
import { Coordinates2D } from "../service/geo-trail-service";
import { MapUtils } from "../map-view/MapUtils";
import { TrailDto, TrailCoordinates } from "../service/trail-service.service";
import { StartIcon } from "../utils/map/MapIconType";
import { EndIcon } from "../utils/map/MapIconType";
import { MapIconType } from "../utils/map/MapIconType";
import { AlertPinIcon } from "../utils/map/MapIconType";
import { CrossWayIcon } from "../utils/map/MapIconType";
import { RedPinIcon } from "../utils/map/MapIconType";

export interface Marker {
  coords: Coordinates2D;
  icon: MapIconType
}

@Component({
  selector: "app-map-preview",
  templateUrl: "./map-preview.component.html",
  styleUrls: ["./map-preview.component.scss"],
})
export class MapPreviewComponent implements OnInit {

  @Input() classPrefix: string;
  @Input() otherTrails: TrailDto[];
  @Input() markersCoordinates: Marker[];
  @Input() trailPreview: TrailDto;
  @Input() elementAt: number;
  @Input() index: string;
  @Input() isShowOtherTrailsEnabled: boolean;

  private map: L.Map;
  private polyline: L.Polyline;
  private lastPointMarker: L.Marker;
  private startPointMarker: L.Marker;
  private markers: L.Marker[];
  private selectionCircle: L.Circle;

  private otherTrailPolys: L.Polyline[];

  isPreviewVisible: boolean;

  constructor() {}

  ngOnInit(): void {
    this.index = this.index ? this.index : "0";
    this.classPrefix = this.classPrefix ? this.classPrefix : "map-table-"
    this.markers = this.markers ? this.markers : [];
    this.isShowOtherTrailsEnabled = this.isShowOtherTrailsEnabled
      ? this.isShowOtherTrailsEnabled
      : true;
  }

  ngAfterViewInit() {
    let openStreetmapCopy: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    let topoLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: openStreetmapCopy }
    );
    this.initMap(topoLayer, this.index);
  }

  private initMap(topoLayer: L.TileLayer, index: string) {
    this.map = L.map(this.classPrefix + index, {
      layers: [topoLayer],
      maxZoom: 17,
    });
    this.map.setView([44.498955, 11.327591], 12);

    if (this.trailPreview) {
      this.onPreview(this.trailPreview.coordinates);
    }
    if (this.elementAt != undefined) {
      this.onSelection(this.elementAt);
    }
    if (this.markersCoordinates) {
      this.drawMarkers(this.markersCoordinates);
    }
  }

  drawMarkers(markersCoords: Marker[]) {
    this.markers = markersCoords.map((marker) => {
      if(marker) {
        return L.marker(
            {lng: marker.coords.longitude, lat: marker.coords.latitude},
            {icon: this.determineIcon(marker.icon)}
        );
      }
    });

    this.markers.forEach((m) => {
      this.map.addLayer(m);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isInitialized()) {
      return;
    }
    this.map.invalidateSize();
    for (const propName in changes) {
      if (propName == "trailPreview") {
        if (this.trailPreview) {
          this.onPreview(this.trailPreview.coordinates);
        }
      }
      if (propName == "elementAt") {
        this.onSelection(this.elementAt);
      }
    }
  }

  onSelection(elementAt: number) {
    console.log("Rendering point at index " + elementAt);
    if (this.selectionCircle) this.map.removeLayer(this.selectionCircle);
    const trailCoords = this.trailPreview.coordinates;
    this.selectionCircle = L.circle(
      [trailCoords[elementAt].latitude, trailCoords[elementAt].longitude],
      { radius: 20, color: "red" }
    ).addTo(this.map);
    this.map.addLayer(this.selectionCircle);
    this.map.flyTo(this.selectionCircle.getLatLng());
  }

  onPreview(trailPreviewCoordinates: TrailCoordinates[]): void {
    this.clearMap();
    let coordinatesLatLngs = MapUtils.getCoordinatesInverted(
      trailPreviewCoordinates
    );
    this.polyline = L.polyline(coordinatesLatLngs, {
      color: "red",
    });
    this.polyline.addTo(this.map);
    this.startPointMarker = L.marker(coordinatesLatLngs[0], {
      icon: StartIcon.get(),
    });
    this.lastPointMarker = L.marker(
      coordinatesLatLngs[coordinatesLatLngs.length - 1], {
        icon: EndIcon.get()
      }
    );
    this.lastPointMarker.addTo(this.map);
    this.startPointMarker.addTo(this.map);
    this.map.fitBounds(this.polyline.getBounds());
  }

  togglePreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
    if (this.isPreviewVisible) {
      this.showTrails();
    } else {
      this.remoteTrails();
    }
  }

  private remoteTrails() {
    this.otherTrailPolys.forEach((poly) => {
      this.map.removeLayer(poly);
    });
  }

  private showTrails() {
    this.otherTrails.forEach((trail) => {
      let invertedCoords = MapUtils.getCoordinatesInverted(trail.coordinates);
      let polyline = L.polyline(invertedCoords, { color: "#fff" });
      polyline.bindPopup(trail.code).openPopup();
      polyline.addTo(this.map);
      this.otherTrailPolys.push(polyline);
    });
  }

  clearMap(): void {
    if (this.polyline != null) {
      this.map.removeLayer(this.polyline);
    }
    if (this.lastPointMarker != null) {
      this.map.removeLayer(this.lastPointMarker);
    }
  }

  isInitialized(): boolean {
    return this.map != null;
  }

  focusOnTrail(): void {
    this.map.fitBounds(this.polyline.getBounds());
  }

  private determineIcon(mapIcon: MapIconType) {
    switch (mapIcon) {
      case MapIconType.ALERT_PIN: 
        return AlertPinIcon.get();
      case MapIconType.CROSSWAY_ICON:
        return CrossWayIcon.get();
      case MapIconType.RED_PIN:
        return RedPinIcon.get();
    }
  }
}
