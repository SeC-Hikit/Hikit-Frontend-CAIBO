import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Marker } from "src/app/map-preview/map-preview.component";
import { Coordinates2D } from "src/app/service/geo-trail-service";
import { PlaceResponse, PlaceService } from "src/app/service/place.service";
import { Trail } from "src/app/service/trail-service.service";

@Component({
  selector: "app-trail-intersection-entry",
  templateUrl: "./trail-intersection-entry.component.html",
  styleUrls: ["./trail-intersection-entry.component.scss"],
})
export class TrailIntersectionEntryComponent implements OnInit {
  @Input() i: number;
  @Input() inputForm: FormGroup;
  @Input() trail: Trail;
  @Input() otherTrail: Trail;
  @Input() crossPoint: Marker;

  isCompleted: boolean;
  isShowing: boolean;

  isAutoDetected: boolean;
  hasAutoDetectedRun: boolean;

  geolocationResponse: PlaceResponse;

  private readonly GEO_LOCATION_DISTANCE = 250;
  private readonly MAX_NUMBER_GEOLOCATION = 3;

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {
    this.isCompleted = false;
    this.hasAutoDetectedRun = false;
    this.isAutoDetected = false;
  }

  toggleShowing(): void {
    this.isShowing = !this.isShowing;
  }

  findPlaceCorrespondingTo() {
    // TODO: add call
    this.placeService
      .geolocatePlace(
        {
          coordinatesDto: {
            altitude: 0,
            latitude: this.crossPoint.coords.latitude,
            longitude: this.crossPoint.coords.longitude,
          },
          distance: this.GEO_LOCATION_DISTANCE,
        },
        0,
        this.MAX_NUMBER_GEOLOCATION
      )
      .subscribe((response) => {
        console.log(response)
        this.geolocationResponse = response;
        this.hasAutoDetectedRun = true;
        this.isAutoDetected = response.content.length != 0;
      });
  }
}
