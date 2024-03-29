import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import 'leaflet';
import {LeafletMouseEvent, LeafletMouseEventHandlerFn} from 'leaflet';
import 'leaflet-textpath';
import {Coordinates2D, RectangleDto} from 'src/app/service/geo-trail-service';
import {CoordinatesDto, TrailDto} from 'src/app/service/trail-service.service';
import {UserCoordinates} from 'src/app/UserCoordinates';
import {GraphicUtils} from 'src/app/utils/GraphicUtils';
import {MapUtils, ViewState} from '../MapUtils';
import {TrailToPolyline} from '../TrailToPolyline';
import {AccessibilityNotification} from "../../service/notification-service.service";
import {Marker} from 'src/app/map-preview/map-preview.component';
import {MapPinIconType} from "../../../assets/icons/MapPinIconType";
import {PoiDto} from "../../service/poi-service.service";
import {PlaceRefDto} from "../../service/place.service";
import {environment} from "../../../environments/environment";
import {DrawPoint} from "../map.component";

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


    hint: string = ""
    timeIntervalMsBeforeTrigger: number = 600;
    intervalObject: any;
    selectionCircle;

    map: L.Map;
    selectedLayer: L.TileLayer;
    selectedTrailLayer: TrailToPolyline;
    selectedMarkerLayer: L.Marker;
    locationsOnTrail: L.Circle[] = [];
    trailCodeMarkers: L.Marker[] = [];
    notificationMarkers: L.Marker[] = [];
    poiMarkers: L.Marker[] = [];

    waypoints: L.Circle[] = [];
    userCircle: L.Circle = null

    otherTrailsPolylines: TrailToPolyline[];

    userCustomItineraryPolyline: L.Polyline;

    openStreetmapCopy: string;

    @Input() viewState: ViewState;
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
    @Input() isMobileView: boolean;
    @Input() zoomToTrail: boolean;
    @Input() isRefresh: boolean;
    @Input() isDrawMode: boolean;
    @Input() drawNewWaypoints: DrawPoint[] = [];


    @Output() onTrailClick = new EventEmitter<string>();
    @Output() onNotificationClick = new EventEmitter<string>();
    @Output() onViewChange = new EventEmitter<RectangleDto>();
    @Output() onZoomChange = new EventEmitter<number>();

    @Output() onLoading = new EventEmitter<void>();
    @Output() onDoneLoading = new EventEmitter<void>();
    @Output() onPoiClick = new EventEmitter<PoiDto>();
    @Output() onLocationSelection = new EventEmitter<PlaceRefDto>();

    @Output() onMunicipalitySelectionClick = new EventEmitter();
    @Output() onTerrainChangeSelectionClick = new EventEmitter();
    @Output() onGeolocaliseMeSelectionClick = new EventEmitter();
    @Output() onSearchClick = new EventEmitter();
    @Output() onDrawItineraryClick = new EventEmitter();
    @Output() onMapDrawClick = new EventEmitter<Coordinates2D>();
    @Output() onShowDrawMode = new EventEmitter<void>();
    @Output() onDeleteCustomItinerary = new EventEmitter<void>();
    @Output() onCalculateItinerary = new EventEmitter<void>();


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
        })
        this.map = L.map(MapFullComponent.MAP_ID, {
            layers: [this.selectedLayer],
            maxZoom: this._maxZoom,
            minZoom: this._minZoom,
            maxBoundsViscosity: 1,
            maxBounds: new L.LatLngBounds(
                new L.LatLng(environment.northWestBoundsLatLng[0], environment.northWestBoundsLatLng[1]),
                new L.LatLng(environment.southEastBoundsLatLng[0], environment.southEastBoundsLatLng[1])),
        })
            .setView(
                [44.498955, 11.327591], // TODO: remember last visited area
                this.startingZoomLevel
            );

        L.control.scale({position: 'topright'}).addTo(this.map);
        this.attachEventListeners();

        this.map.getContainer().addEventListener("contextmenu", function (domEvent) {
            domEvent.preventDefault();
        });
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

        this.map.on("dblclick", (event: LeafletMouseEvent) => {
            this.onDrawWaypoint(event);
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
        this.onViewChange.emit(rectangleDtoFromLatLng)
    }

    ngAfterViewInit(): void {
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
                if (propName == "isRefresh") {
                    this.refreshMapTiles();
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
                    this.renderTrail(this.selectedTrail, changes.selectedTrail.previousValue)
                }
                if (propName == "pois") {
                    this.renderPois()
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
                if (propName == "zoomToTrail") {
                    this.focusOnTrail();
                }
                if (propName == "viewState") {
                    if (this.viewState == ViewState.DRAW_MODE) this.toggleMapDrawMode();
                }
                if (propName == "drawNewWaypoints") {
                    this.renderDrawnWaypoints();
                }
                if (propName == "isDrawMode") {
                    this.toggleDrawModeEventsListener();
                }
            }
        }
        this.onDoneLoading.emit();
    }

    flyToLocation(highlightedLocation: Coordinates2D) {
        this.map.flyTo({lat: highlightedLocation.latitude, lng: highlightedLocation.longitude}, 15);
    }

    focusOnTrail() {
        this.map.fitBounds(this.selectedTrailLayer
            .getBackgroundPolyline().getBounds());
    }

    focusOnUser(userPosition: UserCoordinates) {
        // TODO shall be removed on update
        if (this.userCircle) {
            this.map.removeLayer(this.userCircle);
        }
        this.userCircle = L.circle([userPosition.latitude, userPosition.longitude],
            {radius: 30, color: 'blue'}).addTo(this.map);
        this.userCircle.bindTooltip("Posizione attuale").openTooltip();
        this.map.addLayer(this.userCircle);
        this.map.flyTo(this.userCircle.getLatLng());
    }

    renderTrail(selectedTrail: TrailDto, previousTrailId: TrailDto) {
        if (this.selectionCircle) {
            this.map.removeLayer(this.selectionCircle);
        }
        this.clearPreviouslySelectedLayer(previousTrailId);
        this.clearPathFromList(selectedTrail);


        const inverted = MapUtils.getCoordinatesInverted(selectedTrail.coordinates);
        const mainPolyline = MapUtils.getPolylineFromCoords(inverted)
        mainPolyline.setStyle(MapUtils.getLineStyle(true, selectedTrail.classification));
        const backgroundPolyline = L.polyline(inverted);
        backgroundPolyline.setStyle(MapUtils.getBackgroundLineStyle(10, 0.9));


        this.selectedTrailLayer = new TrailToPolyline(
            selectedTrail.code, selectedTrail.id, selectedTrail.classification,
            mainPolyline, backgroundPolyline
        )


        this.selectedTrailLayer.getBackgroundPolyline().addTo(this.map);
        this.selectedTrailLayer.getPolyline().addTo(this.map);

        this.showLocations(selectedTrail);
    }

    private getLineWeight() {
        if (this.map.getZoom() > 14) {
            return 10;
        }
        return 6;
    }

    private renderPois(selectedPoi?: PoiDto) {
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
                return this.mapToPolyTrail(trail);
            });
        this.otherTrailsPolylines.forEach(trailToPoly => {
            this.addInteractiveTrailToMap(trailToPoly);
        });
    }

    private mapToPolyTrail(trail: TrailDto) {
        let coordinatesInverted = MapUtils.getCoordinatesInverted(trail.coordinates);
        const lineWeight = this.getLineWeight();
        return new TrailToPolyline(trail.code,
            trail.id,
            trail.classification,
            L.polyline(coordinatesInverted,
                MapUtils.getLineStyle(false, trail.classification)),

            L.polyline(coordinatesInverted,
                MapUtils.getBackgroundLineStyle(lineWeight)),
        )
    }

    private addInteractiveTrailToMap(trailToPoly: TrailToPolyline) {
        this.map.addLayer(trailToPoly.getBackgroundPolyline().bringToBack())
        this.map.addLayer(trailToPoly.getPolyline().bringToBack());
        const eventType = this.isDrawMode ? "contextmenu" : "click";
        trailToPoly.getBackgroundPolyline().on(eventType, () => {
            this.onSelectTrail(trailToPoly.getId())();
        });
        trailToPoly.getPolyline().on(eventType, () => {
            this.onSelectTrail(trailToPoly.getId())();
        });
        trailToPoly.getPolyline().on("mouseover", this.highlightTrail(trailToPoly));
        trailToPoly.getPolyline().on("mouseout", this.dehighlightTrail(trailToPoly));
        trailToPoly.getBackgroundPolyline().on("mouseover", this.highlightTrail(trailToPoly));
        trailToPoly.getBackgroundPolyline().on("mouseout", this.dehighlightTrail(trailToPoly));
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
            this.hint = trailToPoly.getCode();
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

    clearPreviouslySelectedLayer(previousTrail: TrailDto) {
        if (this.selectedTrailLayer) {
            this.map.removeLayer(this.selectedTrailLayer.getBackgroundPolyline());
            this.map.removeLayer(this.selectedTrailLayer.getPolyline());


            if (previousTrail != null) {
                const previousTrailPolyline = this.mapToPolyTrail(previousTrail);
                this.addInteractiveTrailToMap(previousTrailPolyline);
            }
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
            const eventType = this.isDrawMode ?
                "contextmenu" : "click";
            marker.on(eventType, this.onSelectTrail(trail.id))
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
                    "https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=84b5c19849154538affddb0a8f385979",
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
            this.showTrailMarkers();
            return;
        }
        this.removeTrailMarkers();
    }

    private renderNotification(selectedTrailNotification: AccessibilityNotification[]) {
        this.notificationMarkers.forEach((it) => this.map.removeLayer(it));
        selectedTrailNotification.forEach((it) => {
            const color = it.minor ? "#ECC333" : "#D04341";
            const marker: Marker = {
                icon: MapPinIconType.ALERT_PIN, color: color,
                coords: {latitude: it.coordinates.latitude, longitude: it.coordinates.longitude}
            };
            const notificationMarker = L.marker(
                {lng: it.coordinates.longitude, lat: it.coordinates.latitude},
                {icon: MapUtils.determineIcon(marker)}
            );
            const eventType = this.isDrawMode ? "contextmenu" : "click";
            notificationMarker.on(eventType, () => this.onNotificationClick.emit(it.id));
            this.notificationMarkers.push(notificationMarker);
            this.map.addLayer(notificationMarker)
        });
    }


    private onPoiHoveringChange(poiHovering: PoiDto) {
        if (!poiHovering) {
            this.renderPois();
            return;
        }
        this.renderPois(this.poiHovering);
    }

    private showLocations(selectedTrail: TrailDto) {
        this.locationsOnTrail.forEach(it => this.map.removeLayer(it));
        selectedTrail.locations
            .forEach(it => {
                const circle = L.circle(
                    [it.coordinates.latitude, it.coordinates.longitude],
                    {radius: MapFullComponent.HALF_CIRCLE_SIZE, fill: true, fillColor: "red", color: "red"});
                const eventType = this.isDrawMode ? "contextmenu" : "click";
                circle.on(eventType, () => this.onLocationSelection.emit(it))
                circle.on("mouseover", () => this.highlightPlaceLocation(circle, it));
                circle.addTo(this.map);
                this.locationsOnTrail.push(circle);
                this.map.addLayer(circle);
            })
    }

    private highlightPlaceLocation(location_circle: L.Circle, it: PlaceRefDto) {
        this.map.removeLayer(location_circle)
        this.locationsOnTrail.splice(this.locationsOnTrail.indexOf(location_circle), 1);
        let latLng = location_circle.getLatLng();
        this.hint = it.name;
        const circle = L.circle(
            [latLng.lat, latLng.lng],
            {radius: MapFullComponent.CIRCLE_SIZE, fill: true, fillColor: "yellow", color: "yellow"});
        const eventType = this.isDrawMode ? "contextmenu" : "click";
        circle.on(eventType, () => this.onLocationSelection.emit(it))
        circle.on("mouseout", () => this.dehighlightPlaceLocation());
        this.locationsOnTrail.push(circle)
        this.map.addLayer(circle)
    }

    private dehighlightPlaceLocation() {
        this.showLocations(this.selectedTrail)
    }

    private onTrailHoveringChange(trailHovering: TrailDto) {
        if (trailHovering == null) {
            this.renderAllTrail(this.trailList);
            return;
        }
        this.hint = trailHovering.code;
        let highlightedElement = this.otherTrailsPolylines.filter(it => it.getId() == trailHovering.id);
        highlightedElement.forEach(it => {
            this.map.removeLayer(it.getPolyline())
            it.getPolyline().setStyle(MapUtils.getLineStyle(true,
                it.getClassification(), "yellow"));
            it.getPolyline().addTo(this.map);
        });
    }

    private refreshMapTiles() {
        const zoom = this.map.getZoom();
        this.map.setZoom(zoom - 1, {animate: true});
        setTimeout(() => {
            console.log("da " + zoom)
            this.map.setZoom(zoom, {animate: true});
        }, 500)

    }

    private toggleMapDrawMode() {
        if (this.viewState == ViewState.DRAW_MODE) {
            this.map.doubleClickZoom.disable();
        } else {
            this.map.doubleClickZoom.enable();
            this.waypoints.forEach((it) => this.map.removeLayer(it))
            this.waypoints = [];
        }
    }

    private onDrawWaypoint(event: LeafletMouseEvent) {
        if (this.viewState != ViewState.DRAW_MODE)
            return;
        this.onMapDrawClick.emit({latitude: event.latlng.lat, longitude: event.latlng.lng});
    }

    private renderDrawnWaypoints() {
        if (this.userCustomItineraryPolyline) this.userCustomItineraryPolyline.remove();
        this.userCustomItineraryPolyline = L.polyline(this.drawNewWaypoints.map((x) =>
            [x.point.latitude, x.point.longitude]), {color: 'blue'})
        this.userCustomItineraryPolyline.addTo(this.map);

        this.waypoints.forEach((it) => this.map.removeLayer(it))
        this.waypoints = this.drawNewWaypoints.slice(0, this.drawNewWaypoints.length - 1).map(waypoint =>
            L.circle([waypoint.point.latitude, waypoint.point.longitude],
                {radius: 30, color: 'blue'})
        );

        const lastPoint = (this.drawNewWaypoints.length > 1) ?
            this.drawNewWaypoints[this.drawNewWaypoints.length - 1] : this.drawNewWaypoints[0];
        if (lastPoint) this.waypoints.push(
            L.circle([
                    lastPoint.point.latitude, lastPoint.point.longitude],
                {radius: 30, color: '#1D9566'})
        )

        this.waypoints.forEach(it => it.addTo(this.map));
    }

    toggleDrawModeEventsListener() {
        const eventTypeToBeRemoved = this.isDrawMode ? "click" : "contextmenu";
        this.locationsOnTrail.forEach((circlesOnTrails) => {
            circlesOnTrails.removeEventListener(eventTypeToBeRemoved);
        })
        this.trailCodeMarkers.forEach((trailCodeMarkers) => {
            trailCodeMarkers.removeEventListener(eventTypeToBeRemoved);
        })
        this.notificationMarkers.forEach((trailCodeMarkers) => {
            trailCodeMarkers.removeEventListener(eventTypeToBeRemoved);
        })
        this.poiMarkers.forEach((poiMarker) => {
            poiMarker.removeEventListener(eventTypeToBeRemoved);
        })
        this.otherTrailsPolylines.forEach((trail) => {
            trail.getPolyline().removeEventListener(eventTypeToBeRemoved)
            trail.getBackgroundPolyline().removeEventListener(eventTypeToBeRemoved)
        })

        this.onMoved();
    }


    onShowDrawModeClick() {
        this.onShowDrawMode.emit();
    }

    onDeleteCustomItineraryClick() {
        this.onDeleteCustomItinerary.emit();
    }

    onCalculateItineraryClick() {
        this.onCalculateItinerary.emit();
    }
}
