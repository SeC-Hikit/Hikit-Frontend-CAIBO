import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Marker} from "src/app/map-preview/map-preview.component";
import {Coordinates2D} from "src/app/service/geo-trail-service";
import {PlaceDto, PlaceResponse, PlaceService} from "src/app/service/place.service";
import {TrailDto} from "src/app/service/trail-service.service";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PlacePickerSelectorComponent} from "../trail-upload-management/place-picker-selector/place-picker-selector.component";

@Component({
    selector: "app-trail-intersection-entry",
    templateUrl: "./trail-intersection-entry.component.html",
    styleUrls: ["./trail-intersection-entry.component.scss"],
})
export class TrailIntersectionEntryComponent implements OnInit {
    @Input() i: number;
    @Input() inputForm: FormGroup;
    @Input() trail: TrailDto;
    @Input() otherTrail: TrailDto;
    @Input() crossPoint: Coordinates2D;
    @Output() onPlaceFound: EventEmitter<PlaceDto[]> = new EventEmitter<PlaceDto[]>();

    crossPointMarker: Marker;
    crossWayTitle: string = "Crocevia";
    isCompleted: boolean;
    isShowing: boolean;

    isAutoDetected: boolean;
    hasAutoDetectedRun: boolean;

    geolocationResponse: PlaceResponse;

    private readonly GEO_LOCATION_DISTANCE = 250;
    private readonly MAX_NUMBER_GEOLOCATION = 3;

    constructor(private placeService: PlaceService,
                private modalService : NgbModal) {
    }

    ngOnInit(): void {
        this.isCompleted = false;
        this.hasAutoDetectedRun = false;
        this.isAutoDetected = false;
        this.crossPointMarker = {
            coords: {
                latitude: this.crossPoint.latitude,
                longitude: this.crossPoint.longitude,
            },
            icon: MapPinIconType.CROSSWAY_ICON
        }
    }

    toggleShowing(): void {
        this.isShowing = !this.isShowing;
    }

    findPlaceCorrespondingTo() {
        // TODO: add call
        this.placeService
            .geoLocatePlace(
                {
                    coordinatesDto: {
                        altitude: 0,
                        latitude: this.crossPoint.latitude,
                        longitude: this.crossPoint.longitude,
                    },
                    distance: this.GEO_LOCATION_DISTANCE,
                },
                0,
                this.MAX_NUMBER_GEOLOCATION
            )
            .subscribe((response) => {
                this.geolocationResponse = response;
                this.hasAutoDetectedRun = true;
                this.isAutoDetected = response.content.length != 0;
                if (this.isAutoDetected) {
                    let placePickerRef = this.modalService.open(PlacePickerSelectorComponent);
                    const places : PlaceDto[] = [{
                        id: "0", name: "Abc", description: "", coordinates: [{latitude:5, altitude:5, longitude:3}], tags: [],
                        recordDetails: {realm: "this", onInstance: "bla", uploadedOn: "bli", uploadedBy: "blu"},
                        crossingTrailIds: [], mediaIds: []
                    }]
                    placePickerRef.componentInstance.places = places;

                    // id?: string;
                    // name?: string;
                    // description?: string;
                    // tags?: string[];
                    // mediaIds?: string[];
                    // coordinates?: components["schemas"]["CoordinatesDto"][];
                    // crossingTrailIds?: string[];
                    // recordDetails?: components["schemas"]["RecordDetailsDto"];

                    // this.onPlaceFound.emit(this.geolocationResponse.content);
                }
            });
    }

    changeCrossWayTitle(value: string) {
        this.isCompleted = this.isComplete(value);
        this.crossWayTitle = `Crocevia '${value}'`;
    }

    private isComplete(value: string) {
        return value.length > 2 && this.hasAutoDetectedRun;
    }
}
