import * as L from 'leaflet';
import {LatLngBounds} from 'leaflet';
import {TrailCoordinatesDto} from "../service/trail-service.service";
import {TrailClassification} from "../TrailClassification";
import {RectangleDto} from "../service/geo-trail-service";
import {
    AlertPinIcon,
    CrossWayIcon,
    MapPinIconType, MonumentalTreeIcon,
    PinIcon,
    RuinIcon, ShaletIcon, TentIcon, ViewPinIcon,
    WaterIcon
} from "../../assets/icons/MapPinIconType";
import {Marker} from "../map-preview/map-preview.component";



export enum ViewState {
    NONE = "", TRAIL = "trail",
    POI = "poi", TRAIL_LIST = "list",
    PLACE = "place", ACCESSIBILITY = "accessibility",
    MUNICIPALITY = "municipality"
}

export class MapUtils {

    private static mapLocationString = "/map/"

    public static get LINE_WEIGHT(): number {
        return 3;
    }

    public static getCoordinatesInverted(
        coordinates: TrailCoordinatesDto[]
    ): [number, number][] {
        return coordinates.map((x) => [x.latitude, x.longitude]);
    }
    static getTrailPolyline(trailCode: string, coordinates: TrailCoordinatesDto[], color: string = "#000") {
        const invertedCoords = MapUtils.getCoordinatesInverted(coordinates);
        const polyline = L.polyline(invertedCoords, {color: color});
        polyline.bindPopup(trailCode).openPopup();
        return polyline;
    }

    static getBackgroundLineStyle(lineWeight = 5, opacity = 0.6) {
        return MapUtils.getLineStyle(false, TrailClassification.T,
            "white", lineWeight, opacity)
    }

    static getPolylineFromCoords(coordinatesInverted) {
        return L.polyline(coordinatesInverted);
    }

    static getLineStyle(isSelectedLine: boolean, trailClassification: String,
                        trailColor: String = null, lineStyleWeight = null, fillOpacity = null): any {
        const electedTrailColor = !trailColor ? MapUtils.getLineColor(isSelectedLine) : trailColor;
        const electedLineWeight = !lineStyleWeight ? MapUtils.LINE_WEIGHT : lineStyleWeight;
        const electedFillOpacity = !fillOpacity ? 1 : fillOpacity;
        switch (trailClassification) {
            case TrailClassification.EEA:
                return {
                    weight: electedLineWeight,
                    color: electedTrailColor,
                    dashArray: "2, 10",
                    opacity: electedFillOpacity
                };
            case TrailClassification.EE:
                return {
                    weight: electedLineWeight,
                    color: electedTrailColor,
                    dashArray: "7, 10",
                    opacity: electedFillOpacity
                };
            default:
                return {weight: electedLineWeight, color: electedTrailColor, opacity: electedFillOpacity};
        }
    }

    static getLineColor(isSelectedLine: boolean): string {
        return isSelectedLine ? "red" : "#f57777";
    }

    static getTrailIcon(code: string) {
        return L.divIcon({
            className: 'trailmap-marker',
            iconSize: null,
            html: '<div class="trail-map-icon"><span class="red">' +
                '</span><span class="white"><span class="code">' + code +
                '</span></span><span class="red"></span></div>',
            iconAnchor: [20, 5]
        });
    }

    static determinePoiType(type: String, microType: string[]) {
        switch (type) {
            case "CULTURAL":
                if (microType.indexOf("tree") >= 0) {
                    return MapPinIconType.MONUMENTAL_TREE
                }
                return MapPinIconType.RUIN_PIN;
            case "SUPPORT":
                if (microType.indexOf("shalet") >= 0) {
                    return MapPinIconType.SHALET
                }
                if (microType.indexOf("camping") >= 0 || microType.indexOf("picnic-area") >= 0) {
                    return MapPinIconType.CAMPING_PIN
                }
                if (microType.indexOf("fountain") >= 0) {
                    return MapPinIconType.WATER_PIN
                }
                return MapPinIconType.VIEW_PIN;
            case "BELVEDERE":
                return MapPinIconType.VIEW_PIN;
            default:
                return MapPinIconType.PIN;
        }
    }

    static determineIcon(marker: Marker) {
        switch (marker.icon) {
            case MapPinIconType.ALERT_PIN:
                return AlertPinIcon.get(marker.color);
            case MapPinIconType.CROSSWAY_ICON:
                return CrossWayIcon.get();
            case MapPinIconType.PIN:
                if (marker.color) return PinIcon.get(marker.color);
                return PinIcon.get();
            case MapPinIconType.MONUMENTAL_TREE:
                if (marker.color) return MonumentalTreeIcon.get(marker.color);
                return MonumentalTreeIcon.get();
            case MapPinIconType.WATER_PIN:
                if (marker.color) return WaterIcon.get(marker.color);
                return WaterIcon.get();
            case MapPinIconType.VIEW_PIN:
                if (marker.color) return ViewPinIcon.get(marker.color);
                return ViewPinIcon.get();
            case MapPinIconType.RUIN_PIN:
                if (marker.color) return RuinIcon.get(marker.color);
                return RuinIcon.get();
            case MapPinIconType.CAMPING_PIN:
                if (marker.color) return TentIcon.get(marker.color);
                return TentIcon.get();
            case MapPinIconType.SHALET:
                if (marker.color) return ShaletIcon.get(marker.color);
                return ShaletIcon.get();
            default:
                return PinIcon.get();
        }
    }

    static getRectangleDtoFromLatLng(bounds: LatLngBounds): RectangleDto {
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

    static getViewFromPath(location: string) : ViewState {
        if(location.startsWith(this.mapLocationString + ViewState.TRAIL)){ return ViewState.TRAIL}
        if(location.startsWith(this.mapLocationString + ViewState.POI)){ return ViewState.POI}
        if(location.startsWith(this.mapLocationString + ViewState.ACCESSIBILITY)){ return ViewState.ACCESSIBILITY}
        if(location.startsWith(this.mapLocationString + ViewState.PLACE)){ return ViewState.PLACE}
        return ViewState.NONE;
    }

    static changeUrlToState(state: ViewState, id: string = "") {
        let optionalSlash = id != "" ? "/" : "";
        window.history.pushState({}, '', this.mapLocationString + state + optionalSlash + id)
    }
}
