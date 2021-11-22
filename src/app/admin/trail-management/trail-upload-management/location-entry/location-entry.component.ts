import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Marker} from "src/app/map-preview/map-preview.component";
import {TrailDto, CoordinatesDto} from "src/app/service/trail-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PlacePickerSelectorComponent} from "../place-picker-selector/place-picker-selector.component";
import {PlaceDto, PlaceService} from "../../../../service/place.service";


export interface IndexCoordinateSelector {
    i: number,
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

    isFocusTouched: boolean = false;

    @Input() title: string;
    @Input() showIndex: boolean;
    @Input() classPrefix: string;
    @Input() i: number;
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

    selectedCoordinateIndex: number;

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

    onFocus(): void {
        // Run a geo-search to see what possible places are available close-by
        const coordinate = this.trail.coordinates[this.selectedCoordinateIndex];
        if (!this.isFocusTouched) {

            this.placeService.geolocatePlace({
                coordinatesDto: {
                    altitude: coordinate.altitude,
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude
                }, distance: 1
            }, 0, 100).subscribe((resp) => {
                // if (resp.content.length > 0) {
                let ngbModalRef = this.modalService.open(PlacePickerSelectorComponent);


                let place: PlaceDto = {
                    id: "0",
                    coordinates: [{latitude: 44.143120, longitude: 11.164310, altitude: 0}],
                    crossingTrailIds: [],
                    name: "A place",
                    recordDetails: {realm: "Sec", uploadedBy: "", uploadedOn: "", onInstance: ""},
                    tags: [""],
                    mediaIds: [],
                    description: ""

                }

                ngbModalRef.componentInstance.targetPoint = this.trail.coordinates[this.selectedCoordinateIndex];
                ngbModalRef.componentInstance.trail = this.trail;
                ngbModalRef.componentInstance.otherTrails = this.otherTrails;
                ngbModalRef.componentInstance.places = [place];



                this.onTextFocus.emit({
                    i: this.i, coordinates: {
                        altitude: coordinate.altitude,
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude
                    }
                });
                // }
            });
        }
        this.isFocusTouched = true;
    }

    onSliderChange(eventValue: number): void {
        if (!this.isEditableLocation) {
            return;
        }
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
    }

    onPrevPoint() {
        if (!this.isEditableLocation) {
            return;
        }
        if (this.selectedCoordinateIndex > this.OFFSET_START_POINT) {
            this.selectedCoordinateIndex--;
        }
    }

    reattemptLocalization() {
        this.isFocusTouched = false;
        this.onFocus();
    }
}
