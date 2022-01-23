import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Marker} from "src/app/map-preview/map-preview.component";
import {Coordinates2D} from "src/app/service/geo-trail-service";
import {PlaceDto, PlaceResponse, PlaceService} from "src/app/service/place.service";
import {TrailDto} from "src/app/service/trail-service.service";
import {MapPinIconType} from "../../../../assets/icons/MapPinIconType";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
    PickedPlace,
    PlacePickerSelectorComponent
} from "../trail-upload-management/place-picker-selector/place-picker-selector.component";
import {GeoToolsService} from "../../../service/geotools.service";

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
    isSelectedFromSystem: boolean = false;
    isShowing: boolean;

    isAutoDetected: boolean;
    hasAutoDetectedRun: boolean;

    geolocationResponse: PlaceResponse;

    private readonly GEO_LOCATION_DISTANCE = 200;
    private readonly MAX_NUMBER_GEOLOCATION = 15;

    constructor(private placeService: PlaceService,
                private geoToolService: GeoToolsService,
                private modalService: NgbModal) {
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
        console.log(this.inputForm)
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
                    if (response.content.length > 0) {
                        let ngbModalRef = this.modalService.open(PlacePickerSelectorComponent);

                        ngbModalRef.componentInstance.targetPoint = {
                            latitude: this.crossPoint.latitude,
                            longitude: this.crossPoint.longitude,
                        }
                        ngbModalRef.componentInstance.trail = this.trail;
                        ngbModalRef.componentInstance.otherTrails = this.otherTrail;
                        ngbModalRef.componentInstance.places = response.content;

                        ngbModalRef.componentInstance.onSelection.subscribe((picked: PickedPlace) => {
                            this.inputForm.controls["id"].setValue(picked.place.id);
                            this.inputForm.controls["name"].setValue(picked.place.name);
                            this.inputForm.controls["tags"].setValue(picked.place.tags.join(", "));
                            this.onPlaceFound.emit([picked.place]);
                            this.changeCrossWayTitle(picked.place.name)
                            this.isSelectedFromSystem = true;
                            this.isCompleted = true;
                        });

                    }
                }
            });
    }

    changeCrossWayTitle(value: string) {
        this.isCompleted = this.isComplete(value);
        this.crossWayTitle = `Crocevia '${value}'`;
        if (this.isCompleted) {
            this.name.setValue(value);
        }
    }

    deleteGeolocalizedData() {
        this.id.setValue("");
        this.name.setValue("");
        this.tags.setValue("");
        this.description.setValue("");

        this.isCompleted = false;
        this.isAutoDetected = false;
        this.hasAutoDetectedRun = false;
    }

    private isComplete(value: string) {
        return value.length > 2 && this.hasAutoDetectedRun;
    }

    get id() {
        return this.inputForm.controls["id"] as FormControl;
    }

    get name() {
        return this.inputForm.controls["name"] as FormControl;
    }

    get tags() {
        return this.inputForm.controls["tags"] as FormControl;
    }

    get description() {
        return this.inputForm.controls["description"] as FormControl;
    }


}
