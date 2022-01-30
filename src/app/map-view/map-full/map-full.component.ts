import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import 'leaflet';
import {LatLngBounds, LeafletMouseEventHandlerFn} from 'leaflet';
import 'leaflet-textpath';
import {RectangleDto} from 'src/app/service/geo-trail-service';
import {TrailDto, TrailCoordinatesDto, CoordinatesDto} from 'src/app/service/trail-service.service';
import {UserCoordinates} from 'src/app/UserCoordinates';
import {GraphicUtils} from 'src/app/utils/GraphicUtils';
import {MapUtils} from '../MapUtils';
import {TrailToPolyline} from '../TrailToPolyline';

declare let L; // to be able to use L namespace

@Component({
    selector: 'app-map-full',
    templateUrl: './map-full.component.html',
    styleUrls: ['./map-full.component.scss']
})
export class MapFullComponent implements OnInit {

    private static MAP_ID: string = "map-full"

    private static CIRCLE_SIZE: number = 40;

    timeIntervalMsBeforeTrigger: number = 600;
    intervalObject: number;
    selectionCircle;

    map: L.Map;
    selectedLayer: L.TileLayer;
    selectedTrailLayer: L.Polyline;
    selectedMarkerLayer: L.Marker;
    trailCodeMarkers: L.Marker[] = [];

    otherTrailsPolylines: TrailToPolyline[];

    openStreetmapCopy: string;

    @Input() userPosition: UserCoordinates;
    @Input() selectedTrail: TrailDto;
    @Input() trailList: TrailDto[];
    @Input() tileLayerName: string;
    @Input() highlightedLocation: TrailCoordinatesDto;
    @Input() startingZoomLevel: number;
    @Input() showTrailCodeMarkers: boolean;
    @Input() selectedTrailIndex?: number;

    @Output() onTrailClick = new EventEmitter<string>();
    @Output() onViewChange = new EventEmitter<RectangleDto>();
    @Output() onZoomChange = new EventEmitter<number>();

    @Output() onLoading = new EventEmitter<void>();
    @Output() onDoneLoading = new EventEmitter<void>();


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
        this.map = L.map(MapFullComponent.MAP_ID, {layers: [this.selectedLayer], maxZoom: 17})
            .setView(
                [44.498955, 11.327591],
                this.startingZoomLevel
            );

        L.control.scale({position: 'topright'}).addTo(this.map);
        L.geoJSON(MapUtils.getERShape()).addTo(this.map);
        this.attachEventListeners();
        this.onDoneLoading.emit();
    }

    attachEventListeners(): void {
        this.map.on("moveend", (_) => {
            this.onMoved()
        });

        this.map.on("move", (_) => {
            this.onStartMoving()
        });

        this.map.on("zoomend", (_) => {
            this.onZoomChange.emit(this.map.getZoom());
        });

    }

    private onStartMoving() {
        clearTimeout(this.intervalObject);
    }

    private onMoved() {
        clearTimeout(this.intervalObject);
        this.intervalObject = setTimeout(() => {
            this.emitBounds();
        }, this.timeIntervalMsBeforeTrigger);
    }

    private emitBounds() {
        let bounds = this.map.getBounds();
        let rectangleDtoFromLatLng = this.getRectangleDtoFromLatLng(bounds);
        console.log(rectangleDtoFromLatLng)
        this.onViewChange.emit(rectangleDtoFromLatLng)
    }

    private getRectangleDtoFromLatLng(bounds: LatLngBounds): RectangleDto {
        let bottomLeft = bounds.getSouthWest();
        let topRight = bounds.getNorthEast();
        return {
            bottomLeft: {
                latitude: bottomLeft.lat,
                longitude: bottomLeft.lng
            }, topRight: {
                latitude: topRight.lat,
                longitude: topRight.lng,
            }
        }
    }

    ngAfterViewInit(): void {
        let mapHeight = GraphicUtils.getMenuHeight();
        let fullSizeWOBorder = GraphicUtils.getFullHeightSizeWOMenuImage();
        document.getElementById(MapFullComponent.MAP_ID).style.height = fullSizeWOBorder.toString() + "px";
        document.getElementById(MapFullComponent.MAP_ID).style.height = fullSizeWOBorder.toString() + "px";

        // console.log(mapHeight)
        this.map.invalidateSize();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.onLoading.emit();
        if (this.isInitialized()) {
            for (const propName in changes) {
                if (propName == "selectedTrailIndex") {
                    this.focusOnLocationIndex(this.selectedTrailIndex);
                }
                if (propName == "showTrailCodeMarkers") {
                    this.toggleTrailMarkers(this.showTrailCodeMarkers);
                }
                if (propName == "tileLayerName") {
                    this.renderTileLayer(this.tileLayerName)
                }
                if (propName == "trailList") {
                    this.renderAllTrail(this.trailList)
                }
                if (propName == "selectedTrail") {
                    this.renderTrail(this.selectedTrail)
                }
                if (propName == "userPosition") {
                    this.focusOnUser(this.userPosition)
                }
                if (propName == "highlightedLocation") {
                    this.flyToLocation(this.highlightedLocation)
                }
            }
        }
        this.onDoneLoading.emit();
    }

    flyToLocation(highlightedLocation: TrailCoordinatesDto) {
        this.map.flyTo({lat: highlightedLocation.latitude, lng: highlightedLocation.longitude});
    }

    focusOnUser(userPosition: UserCoordinates) {
        // TODO shall be removed on update
        const circle = L.circle([userPosition.latitude, userPosition.longitude],
            {radius: 30, color: 'blue'}).addTo(this.map);
        circle.bindTooltip("Posizione attuale").openTooltip();
        this.map.addLayer(circle);
        this.map.flyTo(circle.getLatLng());
    }

    renderTrail(selectedTrail: TrailDto) {
        // Shall take the polyline from the full list - do not instantiate a new polyline each tim
        // USE restorePathFromList(x);
        if (this.selectionCircle) {
            this.map.removeLayer(this.selectionCircle);
        }
        this.clearPreviouslySelectedLayer();
        this.clearPathFromList(selectedTrail);
        let polyline = L.polyline(MapUtils.getCoordinatesInverted(selectedTrail.coordinates));
        polyline.setStyle(MapUtils.getLineStyle(true, selectedTrail.classification));
        polyline.addTo(this.map);
        this.map.fitBounds(polyline.getBounds());
    }

    renderAllTrail(trailList: TrailDto[]) {
        this.otherTrailsPolylines = trailList.map(trail => {
            return new TrailToPolyline(trail.code,
                trail.id,
                trail.classification,
                L.polyline(MapUtils.getCoordinatesInverted(trail.coordinates),
                    MapUtils.getLineStyle(false, trail.classification)))
        });
        this.otherTrailsPolylines.forEach(trailToPoly => {
            trailToPoly.getPolyline().addTo(this.map)
            trailToPoly.getPolyline().on("click", ()=> { this.onSelectTrail(trailToPoly.getId()) });
            trailToPoly.getPolyline().on("mouseover", this.highlightTrail(trailToPoly));
            trailToPoly.getPolyline().on("mouseout", this.dehighlightTrail(trailToPoly));
        });
    }

    dehighlightTrail(trailToPoly: TrailToPolyline): LeafletMouseEventHandlerFn {
        return () => {
            trailToPoly.getPolyline().setStyle(
                MapUtils.getLineStyle(false,
                    trailToPoly.getClassification()));
        }
    }

    highlightTrail(trailToPoly: TrailToPolyline): LeafletMouseEventHandlerFn {
        return () => {
            trailToPoly
                .getPolyline()
                .setStyle({
                    color: 'yellow',
                    opacity: 3,
                    weight: 5
                });
        }
    }

    onSelectTrail(id: string) {
        let codeEmitter = this.onTrailClick;
        return function () {
            codeEmitter.emit(id)
        };
    }

    renderTileLayer(tileLayerName: string): void {
        this.map.removeLayer(this.selectedLayer);
        this.selectedLayer = this.getLayerByName(tileLayerName);
        this.selectedLayer.addTo(this.map);
    }

    clearPreviouslySelectedLayer() {
        // TODO shall remove previously highlighted line
        if (this.selectedTrailLayer) {
            this.map.removeLayer(this.selectedTrailLayer);
        }
        if (this.selectedMarkerLayer) this.map.removeLayer(this.selectedMarkerLayer);
    }

    restorePathFromList(unselectedTrail: TrailDto) {
        const trailFromOtherTrails = this.otherTrailsPolylines.filter(x => x.getCode() == unselectedTrail.code);
        if (trailFromOtherTrails && trailFromOtherTrails.length > 0) {
            this.map.addLayer(trailFromOtherTrails[0].getPolyline());
        }
    }

    clearPathFromList(selectedTrail: TrailDto) {
        const trailFromOtherTrails = this.otherTrailsPolylines.filter(x => x.getCode() == selectedTrail.code);
        if (trailFromOtherTrails && trailFromOtherTrails.length > 0) {
            this.map.removeLayer(trailFromOtherTrails[0].getPolyline());
        }
    }

    isInitialized(): boolean {
        return this.map != null;
    }

    showTrailMarkers() {
        this.trailList.forEach((trail => {
            let middleCoordinateInTrail = MapFullComponent.getMiddleCoordinateInTrail(trail);
            let icon = MapUtils.getTrailIcon(trail.code);
            let marker =
                L.marker([middleCoordinateInTrail.latitude,
                    middleCoordinateInTrail.longitude], {icon: icon});
            marker.on("click", this.onSelectTrail(trail.id))
            this.trailCodeMarkers.push(marker);
            marker.addTo(this.map)
        }))
    }

    removeTrailMarkers() {
        this.trailCodeMarkers
            .forEach((tcm) => {
                this.map.removeLayer(tcm);
            })
    }

    getLayerByName(layerName: string): L.TileLayer {
        switch (layerName) {
            case "topo":
                return L.tileLayer.wms(
                    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
                    {attribution: this.openStreetmapCopy, opacity: 0.75}
                );
            case "geopolitic":
                return L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {attribution: this.openStreetmapCopy}
                );
            case "geopolitic2":
                return L.tileLayer(
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
                    {attribution: this.openStreetmapCopy}
                );
            default:
                throw new Error("TileLayer not in list");
        }
    }

    private highlightLocation(coordinate: CoordinatesDto) {
        if (this.selectionCircle) {
            this.map.removeLayer(this.selectionCircle);
        }
        this.selectionCircle = L.circle(
            [coordinate.latitude, coordinate.longitude],
            {radius: MapFullComponent.CIRCLE_SIZE, color: "red"})
            .addTo(this.map);
        this.map.addLayer(this.selectionCircle);
    }

    private focusOnLocationIndex(selectedTrailIndex: number) {
        console.log(selectedTrailIndex);
        if (this.selectedTrailIndex >= 0 && this.selectedTrailIndex <
            this.selectedTrail.coordinates.length) {

            this.map.setZoom(14, {animate: true});
            this.flyToLocation(this.selectedTrail.coordinates[selectedTrailIndex]);
            this.highlightLocation(this.selectedTrail.coordinates[selectedTrailIndex]);
        }
    }

    private static getMiddleCoordinateInTrail(selectedTrail: TrailDto): CoordinatesDto {
        let number = Math.ceil(selectedTrail.coordinates.length / 2);
        return selectedTrail.coordinates[number];
    }

    private toggleTrailMarkers(showTrailCodeMarkers: boolean) {
        if (showTrailCodeMarkers) {
            console.log("Showing trail markers")
            this.showTrailMarkers();
            return;
        }
        console.log("Not showing trail markers")
        this.removeTrailMarkers();
    }
}
