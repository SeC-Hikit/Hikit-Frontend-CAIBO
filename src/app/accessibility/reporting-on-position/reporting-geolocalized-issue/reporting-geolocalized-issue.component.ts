import {Component, Input, OnInit} from '@angular/core';
import {CoordinatesDto, TrailDto} from "../../../service/trail-service.service";
import * as L from "leaflet";

@Component({
    selector: 'app-reporting-geolocalized-issue',
    templateUrl: './reporting-geolocalized-issue.component.html',
    styleUrls: ['./reporting-geolocalized-issue.component.scss']
})
export class ReportingGeolocalizedIssueComponent implements OnInit {

    map : L.Map;
    @Input() trails?: TrailDto[];
    @Input() selected?: TrailDto;
    @Input() userPosition: CoordinatesDto;

    constructor() {
    }

    ngOnInit(): void {
        const openStreetmapCopy = '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const topoLayer = L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {attribution: openStreetmapCopy}
        );
        this.initMap(topoLayer);
    }

    private initMap(topoLayer: L.TileLayer) {
        this.map = L.map("reporting-geolocalized-issue-preview", {
            layers: [topoLayer],
            maxZoom: 16,
            scrollWheelZoom: false,
        });
        this.map.setView({
            lat: this.userPosition.latitude,
            lng: this.userPosition.longitude}, 14);
        L.circle({
                lat: this.userPosition.latitude,
                lng: this.userPosition.longitude
            },
            {radius: 40, color: 'blue'}).addTo(this.map);
    }


}
