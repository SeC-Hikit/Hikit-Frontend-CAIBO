import { SimpleChanges } from "@angular/core";
import { Component, Input, OnInit } from "@angular/core";
import * as L from "leaflet";
import { Coordinates2D } from "../geo-trail-service";
import { MapUtils } from "../map-view/MapUtils";
import { Trail, TrailCoordinates } from "../trail-service.service";
import { UserCoordinates } from "../UserCoordinates";

@Component({
  selector: "app-map-preview",
  templateUrl: "./map-preview.component.html",
  styleUrls: ["./map-preview.component.scss"],
})
export class MapPreviewComponent implements OnInit {
  @Input() otherTrails: Trail[];
  @Input() markersCoordinates: Coordinates2D[];
  @Input() trailPreview: Trail;
  @Input() elementAt: UserCoordinates;
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

  private crossWayIcon = L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0B2E20" class="bi bi-signpost-2-fill" viewBox="0 0 16 16">
      <path d="M7.293.707A1 1 0 0 0 7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586A1 1 0 0 0 7.293.707z"/>
    </svg>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  private startIcon = L.divIcon({
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  </svg>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  private endIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="8"/>
  </svg>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  constructor() {}

  ngOnInit(): void {
    this.index = this.index ? this.index : "0";
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
    this.map = L.map("map-table-" + index, {
      layers: [topoLayer],
      maxZoom: 17,
    });
    this.map.setView([44.498955, 11.327591], 12);

    if (this.trailPreview) {
      this.onPreview(this.trailPreview.coordinates);
    }
    if (this.elementAt) {
      this.onSelection(this.elementAt);
    }
    if (this.markersCoordinates) {
      this.drawMarkers(this.markersCoordinates);
    }
  }

  drawMarkers(markersCoords: Coordinates2D[]) {
    this.markers = markersCoords.map((coord) => {
      return L.marker(
        { lng: coord.longitude, lat: coord.latitude },
        { icon: this.crossWayIcon }
      );
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

  onSelection(userPosition: UserCoordinates) {
    if (this.selectionCircle) this.map.removeLayer(this.selectionCircle);
    this.selectionCircle = L.circle(
      [userPosition.latitude, userPosition.longitude],
      { radius: 30, color: "red" }
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
      icon: this.startIcon,
    });
    this.lastPointMarker = L.marker(
      coordinatesLatLngs[coordinatesLatLngs.length - 1], {
        icon: this.endIcon
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
}
