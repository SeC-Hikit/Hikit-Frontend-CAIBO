import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {CoordinatesDto, TrailDto} from "../../../service/trail-service.service";
import * as L from "leaflet";
import {TrailToPolyline} from "../../../map-view/TrailToPolyline";
import {MapUtils} from "../../../map-view/MapUtils";

@Component({
    selector: 'app-reporting-geolocalized-issue',
    templateUrl: './reporting-geolocalized-issue.component.html',
    styleUrls: ['./reporting-geolocalized-issue.component.scss']
})
export class ReportingGeolocalizedIssueComponent implements OnInit {

    public static COLORS = ["#001021", "#1481BA", "#034748",
        "#11B5E4", "#004FA3", "#0CAADC", "#3396FF"]
    private USER_CIRCLE_COLOR = "#ff0000";
    map: L.Map;

    selectedTrailLayer: TrailToPolyline[] = [];
    userPositionCircle: L.Circle;

    @Input() trails?: TrailDto[];
    @Input() selected?: TrailDto;
    @Input() userPosition: CoordinatesDto;

    constructor() {
    }

    ngOnInit(): void {
        const openStreetmapCopy = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const topoLayer = L.tileLayer(
            "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=84b5c19849154538affddb0a8f385979",
            {attribution: openStreetmapCopy}
        );
        this.initMap(topoLayer);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName == "trails") {
                this.renderTrails(this.trails);
            }
            if (propName == "selected") {
                this.renderTrails(this.trails, this.selected);
            }

        }
    }

    private initMap(topoLayer: L.TileLayer) {
        this.map = L.map("reporting-geolocalized-issue-preview", {
            layers: [topoLayer],
            maxZoom: 16,
            scrollWheelZoom: false,
        });
        this.map.setView({
            lat: this.userPosition.latitude,
            lng: this.userPosition.longitude
        }, 14);
        this.userPositionCircle = L.circle({
                lat: this.userPosition.latitude,
                lng: this.userPosition.longitude
            },
            {radius: 40, color: this.USER_CIRCLE_COLOR}).addTo(this.map);
    }


    private renderTrails(trails: TrailDto[], selected: TrailDto = null) {
        if(!this.map) { return; }
        this.map.removeLayer(this.userPositionCircle);
        this.selectedTrailLayer.forEach(it=>this.map.removeLayer(it.getPolyline()));

        this.selectedTrailLayer = trails.map((it, idx) => {
            const inverted = MapUtils.getCoordinatesInverted(it.coordinates);
            const mainPolyline = MapUtils.getPolylineFromCoords(inverted)
            const isToColor = !selected ? true : selected.id == it.id;
            mainPolyline.setStyle(MapUtils.getLineStyle(true,
                it.classification, this.getColorString(idx, isToColor), null,
                isToColor ? 1 : 0.1));
            const backgroundPolyline = L.polyline(inverted);
            backgroundPolyline.setStyle(MapUtils.getBackgroundLineStyle(10, isToColor ? 0.9 : 0));
            backgroundPolyline.bindPopup(it.code).openPopup();
            return new TrailToPolyline(it.code, it.id, it.classification, mainPolyline, backgroundPolyline);
        })
        this.selectedTrailLayer.forEach(it => this.map.addLayer(it.getBackgroundPolyline()))
        this.selectedTrailLayer.forEach(it => this.map.addLayer(it.getPolyline()))
        this.map.addLayer(this.userPositionCircle);
    }

    private getColorString(idx: number, isToColor: boolean = true) {
        if(!isToColor) {
            return "#3f3f3f";
        }
        return ReportingGeolocalizedIssueComponent.COLORS[idx];
    }
}
