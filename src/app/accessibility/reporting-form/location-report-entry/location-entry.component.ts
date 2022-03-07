import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Marker} from "src/app/map-preview/map-preview.component";
import {CoordinatesDto, TrailCoordinatesDto, TrailDto} from "src/app/service/trail-service.service";
import {Coordinates2D} from "../../../service/geo-trail-service";

@Component({
    selector: "app-report-location-entry",
    templateUrl: "./location-entry.component.html",
    styleUrls: ["./location-entry.component.scss"],
})
export class LocationEntryReportComponent implements OnInit {
    private readonly OFFSET_START_POINT = 1;
    private readonly OFFSET_END_POINT = 2;

    @Input() title: string;
    @Input() classPrefix: string;
    @Input() i: number;
    @Input() inputForm?: FormGroup;
    @Input() trail: TrailDto;
    @Input() otherTrails?: TrailDto[];
    @Input() markers?: Marker[];
    @Input() isEditableLocation: boolean;
    @Input() isShowPositionCoords?: boolean;

    @Input() focusPoint?: CoordinatesDto;

    @Input() startPoint: number;

    @Output() onChangePosition?: EventEmitter<CoordinatesDto> = new EventEmitter<CoordinatesDto>();


    selectedCoordinateIndex: number;

    constructor() {
    }

    ngOnInit(): void {
        this.title = this.title || this.title == '' ? this.title : "Località";
        this.isShowPositionCoords = this.isShowPositionCoords ? this.isShowPositionCoords : false;
        this.selectedCoordinateIndex = this.isEditableLocation
            ? this.OFFSET_START_POINT
            : null;
        this.selectedCoordinateIndex = this.startPoint != undefined ? this.startPoint : this.OFFSET_START_POINT;
    }

    onSliderMoved(pointIndex: number): void {
        if (!this.isEditableLocation) {
            return;
        }
        this.selectedCoordinateIndex = pointIndex;
        const selectedPointOnTrail = this.trail.coordinates[pointIndex];

        if(this.inputForm) {
            this.inputForm.controls["latitude"].setValue(
                selectedPointOnTrail.latitude
            );
            this.inputForm.controls["longitude"].setValue(
                selectedPointOnTrail.longitude
            );
            this.inputForm.controls["altitude"].setValue(
                selectedPointOnTrail.altitude
            );
            this.inputForm.controls["distanceFromTrailStart"].setValue(
                selectedPointOnTrail.distanceFromTrailStart
            );
        }

        this.highlightPos(selectedPointOnTrail);
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

        this.highlightPos(this.trail.coordinates[this.selectedCoordinateIndex]);
    }

    onPrevPoint() {
        if (!this.isEditableLocation) {
            return;
        }
        if (this.selectedCoordinateIndex > this.OFFSET_START_POINT) {
            this.selectedCoordinateIndex--;
        }

        this.highlightPos(this.trail.coordinates[this.selectedCoordinateIndex])
    }

    private highlightPos(selectedPointOnTrail: TrailCoordinatesDto) {
        this.onChangePosition.emit({
            longitude: selectedPointOnTrail.longitude,
            latitude: selectedPointOnTrail.latitude,
            altitude: selectedPointOnTrail.altitude
        })
    }
}
