import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import 'leaflet';
import {LeafletMouseEventHandlerFn} from 'leaflet';
import 'leaflet-textpath';
import {Coordinates2D, RectangleDto} from 'src/app/service/geo-trail-service';
import {CoordinatesDto, TrailDto} from 'src/app/service/trail-service.service';
import {UserCoordinates} from 'src/app/UserCoordinates';
import {GraphicUtils} from 'src/app/utils/GraphicUtils';
import {MapUtils} from '../MapUtils';
import {TrailToPolyline} from '../TrailToPolyline';
import {AccessibilityNotification} from "../../service/notification-service.service";
import {Marker} from 'src/app/map-preview/map-preview.component';
import {MapPinIconType} from "../../../assets/icons/MapPinIconType";
import {PoiDto} from "../../service/poi-service.service";
import {PlaceRefDto} from "../../service/place.service";

declare let L; // to be able to use L namespace

@Component({
    selector: 'app-map-full',
    templateUrl: './map-full.component.html',
    styleUrls: ['./map-full.component.scss']
})
export class MapFullComponent implements OnInit {

    private static MAP_ID: string = "map-full"

    private static CIRCLE_SIZE: number = 40;
    private static HALF_CIRCLE_SIZE: number = 15;

    timeIntervalMsBeforeTrigger: number = 600;
    intervalObject: number;
    selectionCircle;

    map: L.Map;
    selectedLayer: L.TileLayer;
    selectedTrailLayer: TrailToPolyline;
    selectedMarkerLayer: L.Marker;
    locationsOnTrail: L.Circle[] = [];
    trailCodeMarkers: L.Marker[] = [];
    notificationMarkers: L.Marker[] = [];
    poiMarkers: L.Marker[] = [];

    otherTrailsPolylines: TrailToPolyline[];

    openStreetmapCopy: string;

    @Input() userPosition: UserCoordinates;
    @Input() pois: PoiDto[];
    @Input() selectedTrail: TrailDto;
    @Input() selectedTrailNotification: AccessibilityNotification[];
    @Input() trailList: TrailDto[];
    @Input() tileLayerName: string;
    @Input() highlightedLocation: Coordinates2D;
    @Input() startingZoomLevel: number;
    @Input() showTrailCodeMarkers: boolean;
    @Input() selectedTrailIndex?: number;
    @Input() poiHovering: PoiDto;
    @Input() trailHovering: TrailDto;


    @Output() onTrailClick = new EventEmitter<string>();
    @Output() onNotificationClick = new EventEmitter<string>();
    @Output() onViewChange = new EventEmitter<RectangleDto>();
    @Output() onZoomChange = new EventEmitter<number>();

    @Output() onLoading = new EventEmitter<void>();
    @Output() onDoneLoading = new EventEmitter<void>();
    @Output() onPoiClick = new EventEmitter<PoiDto>();
    @Output() onLocationSelection = new EventEmitter<PlaceRefDto>();


    constructor() {
        this.otherTrailsPolylines = [];
    }

    private readonly _minZoom = 12;
    private readonly _maxZoom = 17;

    ngOnInit(): void {
        this.openStreetmapCopy =
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        this.selectedLayer = this.getLayerByName("topo");
        this.selectedLayer.on("load", function () {
            console.log("loaded");
        })
        this.map = L.map(MapFullComponent.MAP_ID, {
            layers: [this.selectedLayer],
            maxZoom: this._maxZoom,
            minZoom: this._minZoom
        })
            .setView(
                [44.498955, 11.327591], // TODO: remember last visited area
                this.startingZoomLevel
            );

        L.control.scale({position: 'topright'}).addTo(this.map);
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
        let rectangleDtoFromLatLng = MapUtils.getRectangleDtoFromLatLng(bounds);
        console.log(rectangleDtoFromLatLng)
        this.onViewChange.emit(rectangleDtoFromLatLng)
    }

    ngAfterViewInit(): void {
        let mapHeight = GraphicUtils.getMenuHeight();
        let fullSizeWOBorder = GraphicUtils.getFullHeightSizeWOMenuImage();
        document.getElementById(MapFullComponent.MAP_ID).style.height = fullSizeWOBorder.toString() + "px";
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
                if (propName == "pois") {
                    this.renderPois(this.pois)
                }
                if (propName == "selectedTrailNotification") {
                    this.renderNotification(this.selectedTrailNotification)
                }
                if (propName == "poiHovering") {
                    this.onPoiHoveringChange(this.poiHovering)
                }
                if (propName == "trailHovering") {
                    this.onTrailHoveringChange(this.trailHovering)
                }
                if (propName == "userPosition") {
                    this.focusOnUser(this.userPosition)
                }
                if (propName == "highlightedLocation") {
                    this.flyToLocation(this.highlightedLocation)
                }

                if (propName == "highlightedLocation") {
                    this.flyToLocation(this.highlightedLocation)
                }
            }
        }
        this.onDoneLoading.emit();
    }

    flyToLocation(highlightedLocation: Coordinates2D) {
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
        if (this.selectionCircle) {
            this.map.removeLayer(this.selectionCircle);
        }
        this.clearPreviouslySelectedLayer();
        this.clearPathFromList(selectedTrail);

        let coordinatesInverted = MapUtils.getCoordinatesInverted(selectedTrail.coordinates);
        const mainPolyline = L.polyline(coordinatesInverted);
        mainPolyline.setStyle(MapUtils.getLineStyle(true, selectedTrail.classification));
        const backgroundPolyline = L.polyline(coordinatesInverted);
        backgroundPolyline.setStyle(MapUtils.getBackgroundLineStyle(6, 0.9));


        this.selectedTrailLayer = new TrailToPolyline(
            selectedTrail.code, selectedTrail.id, selectedTrail.classification,
            mainPolyline, backgroundPolyline
        )


        this.selectedTrailLayer.getBackgroundPolyline().addTo(this.map);
        this.selectedTrailLayer.getPolyline().addTo(this.map);

        this.showLocations(selectedTrail);
        this.map.fitBounds(this.selectedTrailLayer.getBackgroundPolyline().getBounds());
    }

    private renderPois(pois: PoiDto[], selectedPoi?: PoiDto) {
        if (this.poiMarkers) {
            this.poiMarkers.forEach((it) => this.map.removeLayer(it));
        }

        this.pois.forEach(
            (it) => {
                const marker: Marker = {
                    icon: MapUtils.determinePoiType(it.macroType, it.microType),
                    coords: {latitude: it.coordinates.latitude, longitude: it.coordinates.longitude}
                };
                if (it == selectedPoi) marker.color = "#1D9566";
                const poiMarker = L.marker(
                    {lng: it.coordinates.longitude, lat: it.coordinates.latitude},
                    {icon: MapUtils.determineIcon(marker)}
                );
                poiMarker.on("click", () => this.onPoiClick.emit(it));
                this.poiMarkers.push(poiMarker);
                this.map.addLayer(poiMarker)
            }
        )
    }

    renderAllTrail(trailList: TrailDto[]) {
        this.otherTrailsPolylines.forEach(it => {
            this.map.removeLayer(it.getPolyline())
            this.map.removeLayer(it.getBackgroundPolyline())

        });

        const electedTrailList = this.selectedTrail ?
            trailList.filter(it => it.id != this.selectedTrail.id) : trailList;
        this.otherTrailsPolylines = electedTrailList
            .map(trail => {
                let coordinatesInverted = MapUtils.getCoordinatesInverted(trail.coordinates);
                return new TrailToPolyline(trail.code,
                    trail.id,
                    trail.classification,
                    L.polyline(coordinatesInverted,
                        MapUtils.getLineStyle(false, trail.classification)),
                    L.polyline(coordinatesInverted,
                        MapUtils.getBackgroundLineStyle()),
                )
            });
        this.otherTrailsPolylines.forEach(trailToPoly => {
            trailToPoly.getBackgroundPolyline().addTo(this.map)
            trailToPoly.getPolyline().addTo(this.map)
            trailToPoly.getBackgroundPolyline().on("click", () => {
                this.onSelectTrail(trailToPoly.getId())();
            });
            trailToPoly.getPolyline().on("click", () => {
                this.onSelectTrail(trailToPoly.getId())();
            });
            trailToPoly.getPolyline().on("mouseover", this.highlightTrail(trailToPoly));
            trailToPoly.getPolyline().on("mouseout", this.dehighlightTrail(trailToPoly));
            trailToPoly.getBackgroundPolyline().on("mouseover", this.highlightTrail(trailToPoly));
            trailToPoly.getBackgroundPolyline().on("mouseout", this.dehighlightTrail(trailToPoly));
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

    onSelectTrail(id: string): () => void {
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
        if (this.selectedTrailLayer) {
            this.map.removeLayer(this.selectedTrailLayer.getBackgroundPolyline());
            this.map.removeLayer(this.selectedTrailLayer.getPolyline());
        }
        if (this.selectedMarkerLayer) this.map.removeLayer(this.selectedMarkerLayer);
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
        this.removeHighlightCircle();
        this.selectionCircle = L.circle(
            [coordinate.latitude, coordinate.longitude],
            {radius: MapFullComponent.CIRCLE_SIZE, color: "red"})
            .addTo(this.map);
        this.map.addLayer(this.selectionCircle);
    }

    private removeHighlightCircle() {
        if (this.selectionCircle) {
            this.map.removeLayer(this.selectionCircle);
        }
    }

    private focusOnLocationIndex(selectedTrailIndex: number) {
        if (selectedTrailIndex == 0) {
            this.removeHighlightCircle();
            return;
        }
        if (this.selectedTrailIndex >= 0 && this.selectedTrailIndex < this.selectedTrail.coordinates.length) {

            // this.map.setZoom(14, {animate: true});
            // this.flyToLocation(this.selectedTrail.coordinates[selectedTrailIndex]);
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

    private renderNotification(selectedTrailNotification: AccessibilityNotification[]) {
        this.notificationMarkers.forEach((it) => this.map.removeLayer(it));
        selectedTrailNotification.forEach((it) => {
            const marker: Marker = {
                icon: MapPinIconType.ALERT_PIN, color: "yellow",
                coords: {latitude: it.coordinates.latitude, longitude: it.coordinates.longitude}
            };
            const notificationMarker = L.marker(
                {lng: it.coordinates.longitude, lat: it.coordinates.latitude},
                {icon: MapUtils.determineIcon(marker)}
            );
            notificationMarker.on("click", () => this.onNotificationClick.emit(it.id));
            this.notificationMarkers.push(notificationMarker);
            this.map.addLayer(notificationMarker)
        });
    }


    private onPoiHoveringChange(poiHovering: PoiDto) {
        if (!poiHovering) {
            this.renderPois(this.pois);
            return;
        }
        this.renderPois(this.pois, this.poiHovering);
    }

    private showLocations(selectedTrail: TrailDto) {
        this.locationsOnTrail.forEach(it => this.map.removeLayer(it));
        selectedTrail.locations
            .forEach(it => {
                const circle = L.circle(
                    [it.coordinates.latitude, it.coordinates.longitude],
                    {radius: MapFullComponent.HALF_CIRCLE_SIZE, fill: true, fillColor: "red", color: "red"});
                circle.on("click", ()=> this.onLocationSelection.emit(it))
                circle.on("mouseover", ()=> this.highlightPlaceLocation(circle, it));
                circle.addTo(this.map);
                this.locationsOnTrail.push(circle);
                this.map.addLayer(circle);
            })
    }

    private highlightPlaceLocation(location_circle: L.Circle, it: PlaceRefDto) {
        this.map.removeLayer(location_circle)
        this.locationsOnTrail.splice(this.locationsOnTrail.indexOf(location_circle), 1);
        let latLng = location_circle.getLatLng();
        const circle = L.circle(
            [latLng.lat, latLng.lng],
            {radius: MapFullComponent.CIRCLE_SIZE, fill: true, fillColor: "yellow", color: "yellow"});
        circle.on("click", ()=> this.onLocationSelection.emit(it))
        circle.on("mouseout", ()=> this.dehighlightPlaceLocation(circle));
        this.locationsOnTrail.push(circle)
        this.map.addLayer(circle)
    }

    private dehighlightPlaceLocation(location: L.Circle){
        this.showLocations(this.selectedTrail)
    }

    onClickGeolocalize() {

    }

    private onTrailHoveringChange(trailHovering: TrailDto) {
        if (trailHovering == null) {
            this.renderAllTrail(this.trailList);
            return;
        }
        let highlightedElement = this.otherTrailsPolylines.filter(it => it.getId() == trailHovering.id);
        highlightedElement.forEach(it => {
            this.map.removeLayer(it.getPolyline())
            it.getPolyline().setStyle(MapUtils.getLineStyle(true, it.getClassification(), "yellow"));
            it.getPolyline().addTo(this.map);
        });
    }
}
