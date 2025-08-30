import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {TrailDto} from "../service/trail-service.service";
import {Coordinates2D, GeoTrailService} from "../service/geo-trail-service";
import * as L from "leaflet";
import {environment} from "../../environments/environment";
import {MapUtils} from "../map-view/MapUtils";
import {Marker, TrailToGeometry} from "../map-preview/map-preview.component";
import {MunicipalityToTrailDto} from "../service/admin-trail_preview.service";

@Component({
  selector: 'app-map-preview-municipalities',
  templateUrl: './map-preview-municipalities.component.html',
  styleUrls: ['./map-preview-municipalities.component.scss']
})
export class MapPreviewMunicipalitiesComponent implements OnInit {

  @Input() classPrefix: string;
  @Input() trail: TrailDto;
  @Input() municipalitiesToTrails?: MunicipalityToTrailDto[];
  @Input() showDistances: boolean;

  private colors = ["#9b6a6c", "#ffb86f", "#e0ca3c", "#ba5c12", "#3e2f5b", "#261132", "#08415c", "#cc2936"]

  private map: L.Map;
  private polyline: L.Polyline;
  private polylineBorder: L.Polyline;
  private polyLines: L.Polygon[] = [];
  private lastPointMarker: L.Marker;
  private startPointMarker: L.Marker;
  private markers: L.Circle[];
  private selectionCircle: L.Circle;
  private distancePoly: L.Polyline;

  private otherTrailPolys: L.Polyline[] = [];
  private otherTrailToPolys: TrailToGeometry[] = [];


  isPreviewVisible: boolean;

  constructor(private geoTrailService: GeoTrailService) {
  }

  ngOnInit(): void {
    this.classPrefix = this.classPrefix ? this.classPrefix : "map-table-"
    this.markers = this.markers ? this.markers : [];
  }

  ngAfterViewInit() {
    const openStreetmapCopy = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const topoLayer = L.tileLayer(
        "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=84b5c19849154538affddb0a8f385979",
        {attribution: openStreetmapCopy}
    );
    this.initMap(topoLayer);
  }

  private initMap(topoLayer: L.TileLayer) {
    this.map = L.map(this.classPrefix, {
      layers: [topoLayer],
      maxZoom: 16,
      scrollWheelZoom: false,
      maxBoundsViscosity: 1,
      maxBounds: new L.LatLngBounds(
          new L.LatLng(environment.northWestBoundsLatLng[0], environment.northWestBoundsLatLng[1]),
          new L.LatLng(environment.southEastBoundsLatLng[0], environment.southEastBoundsLatLng[1])),
    });
    this.map.setView([44.498955, 11.327591], 11);
    this.drawElements();
  }

  private drawElements() {
    this.polyline = MapPreviewMunicipalitiesComponent.getTrailPolyline(this.trail.code, this.trail.coordinates)
    this.municipalitiesToTrails.forEach(
        (it, index)=> {
            this.polyLines.push(MapPreviewMunicipalitiesComponent.getTrailPolygon(it.details.city, it.shapePoints, this.colors[index]))
            it.intersectionPoints.forEach(
                latLngIntersection =>
                    this.markers.push(L.circle([latLngIntersection.latitude, latLngIntersection.longitude],{radius: 30, color: "red"})))
        }
      )

    this.map.addLayer(this.polyline)
    this.polyLines.forEach(it => this.map.addLayer(it))
    this.markers.forEach(it => this.map.addLayer(it))

    this.map.fitBounds(this.polyline.getBounds())
  }

  static getTrailPolyline(elementName: string, coordinates: Coordinates2D[], color: string = "#000") {
    const invertedCoords = MapUtils.getCoordinatesInverted(coordinates);
    const polyline = L.polyline(invertedCoords, {color: color});
    polyline.bindPopup(elementName).openPopup();
    return polyline;
  }

  static getTrailPolygon(municipalityName: string, coordinates: Coordinates2D[], color: string = "#000") {
    const invertedCoords = MapUtils.getCoordinatesInverted(coordinates);
    const polyline = L.polygon(invertedCoords, {color: color, fillColor: color, fillOpacity: 0.5});
    polyline.bindPopup(municipalityName).openPopup();
    return polyline;
  }


  drawMarkers(markersCoords: Marker[]) {
    this.markers.forEach(it => this.map.removeLayer(it));
    if (this.distancePoly) this.map.removeLayer(this.distancePoly);




  }

  ngOnChanges(changes: SimpleChanges) {
    // this.map.invalidateSize();
    for (const propName in changes) {
      //
    }
  }


}
