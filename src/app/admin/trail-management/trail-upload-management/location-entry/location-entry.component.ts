import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Coordinates2D } from "src/app/geo-trail-service";
import { Trail, TrailCoordinates } from "src/app/trail-service.service";

@Component({
  selector: "app-location-entry",
  templateUrl: "./location-entry.component.html",
  styleUrls: ["./location-entry.component.scss"],
})
export class LocationEntryComponent implements OnInit {
  private readonly OFFSET_START_POINT = 1;
  private readonly OFFSET_END_POINT = 2;

  @Input() title: string;
  @Input() classPrefix: string;
  @Input() i: number;
  @Input() inputForm: FormGroup;
  @Input() trail: Trail;
  @Input() otherTrails: Trail[];
  @Input() markers: Coordinates2D[];
  @Input() isEditableLocation: boolean;

  @Input() startPoint: number;

  selectedCoordinateIndex: number;

  constructor() {}

  ngOnInit(): void {
    this.title = this.title ? this.title : "Località";
    this.selectedCoordinateIndex = this.isEditableLocation
      ? this.OFFSET_START_POINT
      : null;
    this.selectedCoordinateIndex = this.startPoint != undefined ? this.startPoint : this.OFFSET_START_POINT;
  }

  onSliderMoved(eventValue: number): void {
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
}
