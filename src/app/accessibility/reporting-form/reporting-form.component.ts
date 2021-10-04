import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GeoTrailService } from "src/app/service/geo-trail-service";
import { Trail, TrailService } from "src/app/service/trail-service.service";
import { FormUtils } from "src/app/utils/FormUtils";

@Component({
  selector: "app-reporting-form",
  templateUrl: "./reporting-form.component.html",
  styleUrls: ["./reporting-form.component.scss"],
})
export class ReportingFormComponent implements OnInit {
  // The only other option is GPS locating
  isTrailSelection = true;
  trail: Trail;

  trailFormGroup: FormGroup;

  constructor(
    private trailService: TrailService,
    private geoTrailService: GeoTrailService
  ) {
    this.trailFormGroup = new FormGroup({
      code: new FormControl("", Validators.required),
      eta: new FormControl("", Validators.required),
      name: new FormControl(""),
      classification: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      lastUpdate: new FormControl("", Validators.required),
      intersectionExample: new FormControl("", Validators.required),
      maintainingSection: new FormControl("", Validators.required),
      position: FormUtils.getLocationFormGroup(),
    });
  }

  ngOnInit(): void {}
}
