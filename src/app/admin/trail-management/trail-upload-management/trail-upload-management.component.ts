import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { ImportService, TrailRaw, TrailRawResponse } from "src/app/import.service";
import { RestResponse } from "src/app/RestResponse";
import { Status } from "src/app/Status";
import { TrailCoordinates } from "src/app/trail-service.service";
import { TrailCoordinatesObj } from "src/app/TrailCoordinatesObj";
import { TrailImportRequest } from "src/app/TrailImportRequest";
import { FormUtils } from "src/app/utils/FormUtils";
@Component({
  selector: "app-trail-upload-management",
  templateUrl: "./trail-upload-management.component.html",
  styleUrls: ["./trail-upload-management.component.scss"],
})
export class TrailUploadManagementComponent implements OnInit, OnDestroy {
  trailRawResponse: TrailRawResponse;
  previewCoords: TrailCoordinates[];
  trailFormGroup: FormGroup;
  uploadedSuccessful: boolean;
  isLoading = false;

  private destroy$ = new Subject();

  constructor(private importService: ImportService, private router: Router) {}

  ngOnInit(): void {
    this.uploadedSuccessful = false;
    this.trailFormGroup = new FormGroup({
      code: new FormControl("", Validators.required),
      name: new FormControl(""),
      classification: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      lastUpdate: new FormControl("", Validators.required),
      maintainingSection: new FormControl("", Validators.required),
      startPos: FormUtils.getLocationFormGroup(),
      finalPos: FormUtils.getLocationFormGroup(),
      locations: new FormArray([]),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onAddLocation(): void {
    this.locations.push(FormUtils.getLocationFormGroup());
  }

  onReload(): void {
    this.uploadedSuccessful = false;
  }

  uploadFile(files: File[]): void {
      this.isLoading = true;
      this.importService
        .readTrail(files[0])
        .pipe(takeUntil(this.destroy$))
        .subscribe((trailRawResponse: TrailRawResponse) => {
          this.isLoading = false;
          this.uploadedSuccessful = true;
          this.populateForm(trailRawResponse.content[0]);
        });
  }

  uploadFiles(files: FileList): void {
    this.importService
    .readTrails(files)
    .pipe(takeUntil(this.destroy$))
    .subscribe((_) => {
      this.isLoading = false;
      this.uploadedSuccessful = true;
    });
  }

  populateForm(tpm: TrailRaw) {
    this.trailFormGroup.controls["code"].setValue(tpm.name);
    this.trailFormGroup.controls["description"].setValue(tpm.description);
    this.firstPos.controls["name"].setValue('');
    this.firstPos.controls["latitude"].setValue(
      tpm.startPos.latitude
    );
    this.firstPos.controls["longitude"].setValue(
      tpm.startPos.longitude
    );
    this.firstPos.controls["altitude"].setValue(
      tpm.startPos.altitude
    );
    this.firstPos.controls["distanceFromTrailStart"].setValue(
      tpm.startPos.distanceFromTrailStart
    );
    this.finalPos.controls["name"].setValue('');
    this.finalPos.controls["latitude"].setValue(
      tpm.finalPos.latitude
    );
    this.finalPos.controls["longitude"].setValue(
      tpm.finalPos.longitude
    );
    this.finalPos.controls["altitude"].setValue(
      tpm.finalPos.altitude
    );
    this.finalPos.controls["distanceFromTrailStart"].setValue(
      tpm.finalPos.distanceFromTrailStart
    );
  }

  saveTrail() {
    if (this.trailFormGroup.valid) {
      const trailFormValue = this.trailFormGroup.value;
      const importTrail = this.getImportRequest(trailFormValue);
      this.importService
        .saveTrail(importTrail)
        .subscribe((response) => this.onSaveRequest(response));
    } else {
      alert("Alcuni campi contengono errori");
    }
  }

  onSaveRequest(restResponse: RestResponse): void {
    if (restResponse.status === Status.OK) {
      this.router.navigate(["/admin/trails", { success: this.trailRawResponse.content[0].name }]);
    }
  }

  private getImportRequest(trailFormValue: any) {
    const importTrail = trailFormValue as TrailImportRequest;

    importTrail.lastUpdate = moment(
      trailFormValue.lastUpdate.year +
        "-" +
        trailFormValue.lastUpdate.month +
        "-" +
        trailFormValue.lastUpdate.day
    ).toDate();
    let tagsStartPos = trailFormValue.startPos.tags as string;
    let tagsFinalPos = trailFormValue.finalPos.tags as string;
    for (var i = 0; i < trailFormValue.locations.length; i++) {
      let temp = trailFormValue.locations[i];
      importTrail.locations[i].tags =
        temp.tags == null ? [] : temp.tags.split(",");
      importTrail.locations[i].coordinates = new TrailCoordinatesObj(
        temp.latitude,
        temp.longitude,
        temp.altitude,
        temp.distanceFromTrailStart
      );
    }
    importTrail.startPos.tags =
      tagsStartPos == null ? [] : tagsStartPos.split(",");
    importTrail.startPos.coordinates = this.previewCoords[0];
    importTrail.finalPos.tags =
      tagsStartPos == null ? [] : tagsFinalPos.split(",");
    importTrail.finalPos.coordinates = this.previewCoords[
      this.previewCoords.length - 1
    ];
    importTrail.coordinates = this.previewCoords;
    importTrail.name = importTrail.name ? importTrail.name : importTrail.code;
    return importTrail;
  }

  get locations() {
    return this.trailFormGroup.controls["locations"] as FormArray;
  }

  get firstPos() {
    return this.trailFormGroup.controls["startPos"] as FormGroup;
  }

  get finalPos() {
    return this.trailFormGroup.controls["finalPos"] as FormGroup;
  }
}
