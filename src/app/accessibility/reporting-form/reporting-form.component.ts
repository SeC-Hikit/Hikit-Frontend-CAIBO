import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";
import { GeoTrailService } from "src/app/service/geo-trail-service";
import {
  TrailPreview,
  TrailPreviewService,
} from "src/app/service/trail-preview-service.service";
import { Trail, TrailService } from "src/app/service/trail-service.service";
import { FormUtils } from "src/app/utils/FormUtils";

@Component({
  selector: "app-reporting-form",
  templateUrl: "./reporting-form.component.html",
  styleUrls: ["./reporting-form.component.scss"],
})
export class ReportingFormComponent implements OnInit {
  hasLoaded = false;
  // The only other option is GPS locating
  isTrailSelection = true;
  trail: Trail;

  trailPreviews: TrailPreview[];

  trailFormGroup: FormGroup;

  constructor(
    private trailService: TrailService,
    private trailPreviewService: TrailPreviewService,
    private geoTrailService: GeoTrailService,
    private authService: AuthService
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
    this.trailPreviewService
      .getPreviews(0, 10000, authService.getRealm())
      .subscribe((resp) => {
        this.trailPreviews = resp.content;
        if (resp.content.length != 0) {
          
          trailService.getTrailById(resp.content[0].id).subscribe((trailResp)=> {
            this.trail = trailResp.content[0];
            this.hasLoaded = true;
          })
        }
      });
  }

  ngOnInit(): void {}

  get position() {
    return this.trailFormGroup.controls["position"] as FormGroup;
  }
}
