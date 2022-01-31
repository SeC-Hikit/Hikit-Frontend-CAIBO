import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Marker} from "src/app/map-preview/map-preview.component";
import {TrailDto, CoordinatesDto} from "src/app/service/trail-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PickedPlace, PlacePickerSelectorComponent} from "../place-picker-selector/place-picker-selector.component";
import {PlaceService} from "../../../../service/place.service";


export interface IndexCoordinateSelector {
    formComponent: string,
    coordinates: CoordinatesDto
}

@Component({
    selector: "app-location-entry",
    templateUrl: "./location-entry.component.html",
    styleUrls: ["./location-entry.component.scss"],
})
export class LocationEntryComponent implements OnInit {

    private readonly OFFSET_START_POINT = 1;
    private readonly OFFSET_END_POINT = 2;

    private GEOLOCATION_DISTANCE = 5000;

    @Input() title: string;
    @Input() showIndex: boolean;
    @Input() classPrefix: string;
    @Input() i: number;
    @Input() isDeletable?: boolean;

    @Input() inputForm: FormGroup;

    @Input() trail: TrailDto;
    @Input() otherTrails?: TrailDto[];
    @Input() markers?: Marker[];
    @Input() isEditableLocation: boolean;
    @Input() showPositionControls?: boolean;
    @Input() autoDetectOnFirstSelection?: boolean;

    @Input() startPoint: number;

    @Output() onTextFocus?: EventEmitter<IndexCoordinateSelector> = new EventEmitter<IndexCoordinateSelector>();
    @Output() onSearchBtnClick?: EventEmitter<number> = new EventEmitter<number>();
    @Output() onDelete?: EventEmitter<number> = new EventEmitter<number>();

    selectedCoordinateIndex: number;
    hasBeenLocalizedFirstTime: boolean = false;
    hasBeenLocalized: boolean = false;

    constructor(private modalService: NgbModal,
                private placeService: PlaceService) {
    }

    ngOnInit(): void {
        this.showIndex = this.showIndex != undefined;
        this.title = this.title ? this.title : "Località";
        this.selectedCoordinateIndex = this.isEditableLocation
            ? this.OFFSET_START_POINT
            : null;
        this.showPositionControls = this.showPositionControls ? this.showPositionControls : false;
        this.selectedCoordinateIndex = this.startPoint != undefined ? this.startPoint : this.OFFSET_START_POINT;
    }

    onLocalize(): void {
        this.hasBeenLocalizedFirstTime = true;
        // Run a geo-search to see what possible places are available close-by
        const coordinate = this.trail.coordinates[this.selectedCoordinateIndex];
        this.placeService.geoLocatePlace({
            coordinatesDto: {
                altitude: coordinate.altitude,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude
            }, distance: this.GEOLOCATION_DISTANCE // expressed in m
        }, 0, 100).subscribe((resp) => {

            if (resp.content.length > 0) {
                let ngbModalRef = this.modalService.open(PlacePickerSelectorComponent);
                ngbModalRef.componentInstance.targetPoint = this.trail.coordinates[this.selectedCoordinateIndex];
                ngbModalRef.componentInstance.trail = this.trail;
                ngbModalRef.componentInstance.otherTrails = this.otherTrails;
                ngbModalRef.componentInstance.places = resp.content;

                ngbModalRef.componentInstance.onSelection.subscribe((picked: PickedPlace) => {
                    this.id.setValue(picked.place.id);
                    this.name.setValue(picked.place.name);
                    this.id.disable();
                    this.name.disable();
                });

                this.onTextFocus.emit({
                    formComponent: `${this.classPrefix}${this.i}`, coordinates: {
                        altitude: coordinate.altitude,
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude
                    }
                });

                this.hasBeenLocalized = true;
            }
        });

    }

    onSliderChange(eventValue: number): void {
        if (!this.isEditableLocation) {
            return;
        }

        this.deselectLocalization();

        this.selectedCoordinateIndex = eventValue;
        this.inputForm.controls["latitude"].setValue(
            this.trail.coordinates[eventValue].latitude
        );
        this.inputForm.controls["longitude"].setValue(
            this.trail.coordinates[eventValue].longitude
        );
        this.inputForm.controls["altitude"].setValue(
            this.trail.coordinates[eventValue].altitude
        );
        this.inputForm.controls["distanceFromTrailStart"].setValue(
            this.trail.coordinates[eventValue].distanceFromTrailStart
        );
    }

    onNextPoint() {
        if (!this.isEditableLocation) {
            return;
        }
        if (
            this.selectedCoordinateIndex <
            this.trail.coordinates.length - this.OFFSET_END_POINT
        ) {
            this.selectedCoordinateIndex++;
        }
        this.onSliderChange(this.selectedCoordinateIndex);
    }

    onPrevPoint() {
        if (!this.isEditableLocation) {
            return;
        }
        if (this.selectedCoordinateIndex > this.OFFSET_START_POINT) {
            this.selectedCoordinateIndex--;
        }
        this.onSliderChange(this.selectedCoordinateIndex);
    }

    reattemptLocalization() {
        this.hasBeenLocalized = false;
        this.onLocalize();
    }

    changeName($event) {
        this.inputForm.controls["name"].setValue($event.target.value);
        if(this.hasBeenLocalized) this.deselectLocalization()
    }

    deselectLocalization() {
        this.hasBeenLocalized = false;
        this.inputForm.controls["id"].setValue("");
    }

    onDeleteThis() {
        this.onDelete.emit(this.i);
    }

    deleteGeolocalization() {
        this.id.setValue(" ");
        this.name.setValue(" ");
        this.name.enable();
    }

    get id() {
        return this.inputForm.controls["id"] as FormControl;
    }

    get name() {
        return this.inputForm.controls["name"] as FormControl;
    }
}
