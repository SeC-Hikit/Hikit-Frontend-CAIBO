import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Marker} from "src/app/map-preview/map-preview.component";
import {TrailDto, CoordinatesDto} from "src/app/service/trail-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PickedPlace, PlacePickerSelectorComponent} from "../place-picker-selector/place-picker-selector.component";
import {PlaceRefDto, PlaceService} from "../../../../service/place.service";
import {GeoToolsService} from "../../../../service/geotools.service";
import {TrailConfirmModalComponent} from "../../trail-confirm-modal/trail-confirm-modal.component";
import {Coordinates2D} from "../../../../service/geo-trail-service";
import {Crossing} from "../trail-upload-management.component";
import {Observable} from "rxjs";


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

    private MAX_GEOLOCATION_M = 50;

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
    @Input() crossings: Crossing[];

    @Input() startPoint: number;

    @Output() onTextFocus?: EventEmitter<IndexCoordinateSelector> = new EventEmitter<IndexCoordinateSelector>();
    @Output() onSearchBtnClick?: EventEmitter<number> = new EventEmitter<number>();
    @Output() onDelete?: EventEmitter<number> = new EventEmitter<number>();
    @Output() onChange: EventEmitter<PlaceRefDto> = new EventEmitter();

    selectedCoordinateIndex: number;
    hasBeenLocalizedFirstTime: boolean = false;
    hasBeenLocalized: boolean = false;

    constructor(private modalService: NgbModal,
                private placeService: PlaceService,
                private geoToolService: GeoToolsService) {
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
        const coordinate = this.trail.coordinates[this.selectedCoordinateIndex];


        const calculatedDistancesPromises = [];
        this.crossings.forEach((crossing) => {
            calculatedDistancesPromises.push(this.geoToolService.getDistance([coordinate, crossing.coordinate]).toPromise());
        })

        Promise.all(calculatedDistancesPromises).then((results) => {
            results.filter((it, index) => {
                let distance: number = parseFloat(it);
                if (distance < this.MAX_GEOLOCATION_M) {
                    let ngbModalRef = this.modalService.open(TrailConfirmModalComponent);
                    ngbModalRef.componentInstance.maxRadius = this.MAX_GEOLOCATION_M;
                    ngbModalRef.componentInstance.distance = distance.toFixed(0);
                    ngbModalRef.componentInstance.trailCode = this.trail.code;
                    ngbModalRef.componentInstance.locationName = this.getLocationName();
                    ngbModalRef.componentInstance.crossway = this.crossings[index];
                    ngbModalRef.componentInstance.onOk.subscribe((picked: PlaceRefDto) => {
                        this.id.setValue(picked.placeId);
                        this.name.setValue(picked.name);
                        this.id.disable();
                        this.name.disable();
                    });
                    ngbModalRef.componentInstance.onRefusal.subscribe(() => {
                        this.geoLocate(coordinate);
                    })
                }
            });
        }).finally(() => {
            if (this.name.value.trim() == "") {
                this.geoLocate(coordinate);
            }
        })


    }

    private geoLocate(coordinate: { distanceFromTrailStart?: number; latitude?: number; longitude?: number; altitude?: number }) {
        // Run a geo-search to see what possible places are available close-by
        this.placeService.geoLocatePlace({
            coordinatesDto: {
                altitude: coordinate.altitude,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude
            }, distance: this.MAX_GEOLOCATION_M // expressed in m
        }, 0, 100).subscribe((resp) => {

            if (resp.content.length > 0) {
                let ngbModalRef = this.modalService.open(PlacePickerSelectorComponent);
                ngbModalRef.componentInstance.targetPoint = this.trail.coordinates[this.selectedCoordinateIndex];
                ngbModalRef.componentInstance.trail = this.trail;
                ngbModalRef.componentInstance.otherTrails = this.otherTrails;
                ngbModalRef.componentInstance.places = resp.content;
                ngbModalRef.componentInstance.radius = this.MAX_GEOLOCATION_M;

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
        if (this.hasBeenLocalized) this.deselectLocalization()
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

    private getLocationName() {
        if (this.selectedCoordinateIndex == 0) return "iniziale";
        if (this.selectedCoordinateIndex == this.trail.coordinates.length - 1)
            return "finale";
        return "intermedia";
    }
}
