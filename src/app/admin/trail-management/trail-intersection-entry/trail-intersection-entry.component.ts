import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
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
    @Output() onIntersectionNameChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();
    @Output() onDynamicToggle: EventEmitter<void> = new EventEmitter<void>();

    crossPointMarker: Marker;
    crossWayTitle: string = "Crocevia";
    isCompleted: boolean;
    isInputDisabled: boolean = false;
    isShowing: boolean;

    isAutoDetected: boolean;
    hasAutoDetectedRun: boolean;

    geolocationResponse: PlaceResponse;

    private readonly MAX_GEOLOCATION_M = 50;

    constructor(private placeService: PlaceService,
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
        this.placeService
            .geoLocatePlace(
                {
                    coordinatesDto: {
                        altitude: 0,
                        latitude: this.crossPoint.latitude,
                        longitude: this.crossPoint.longitude,
                    },
                    distance: this.MAX_GEOLOCATION_M,
                },
                0,
                this.MAX_GEOLOCATION_M
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
                        ngbModalRef.componentInstance.otherTrails = [this.otherTrail];
                        ngbModalRef.componentInstance.places = response.content;
                        ngbModalRef.componentInstance.radius = this.MAX_GEOLOCATION_M;

                        ngbModalRef.componentInstance.onSelection.subscribe((picked: PickedPlace) => {
                            this.inputForm.controls["id"].setValue(picked.place.id);
                            this.inputForm.controls["name"].setValue(picked.place.name);
                            this.inputForm.controls["isDynamic"].setValue(picked.place.dynamic);
                            this.onPlaceFound.emit([picked.place]);
                            this.changeCrossWayTitle(picked.place.name)
                            this.name.disable();
                            this.isInputDisabled = true;
                            this.isCompleted = true;
                        });

                    }
                }
            });
    }

    onToggleDynamic() {
        this.isInputDisabled = this.isDynamic.value;
        this.isCompleted = this.isDynamic.value;
    }

    changeCrossWayTitle(value: string) {
        this.isCompleted = this.isComplete(value);
        this.crossWayTitle = `Crocevia '${value}'`;
        this.onIntersectionNameChange.emit(value);
        if (this.isCompleted) {
            this.name.setValue(value);
        }
    }

    deleteGeolocalizedData() {
        this.id.setValue(" ");
        this.name.setValue("");
        this.name.enable();
        this.isCompleted = false;
        this.isAutoDetected = false;
    }

    onDeleteEvent() {
        console.log("delete")
        this.onDelete.emit();
    }

    private isComplete(value: string) {
        return value.length > 2 && this.hasAutoDetectedRun;
    }

    get id() {
        return this.inputForm.controls["id"] as FormControl;
    }

    get isDynamic() {
        return this.inputForm.get("isDynamic") as FormControl;
    }

    get name() {
        return this.inputForm.controls["name"] as FormControl;
    }
}