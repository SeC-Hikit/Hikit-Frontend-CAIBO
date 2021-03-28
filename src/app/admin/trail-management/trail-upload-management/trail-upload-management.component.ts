import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { ImportService } from "src/app/import.service";
import { RestResponse } from "src/app/RestResponse";
import { Status } from "src/app/Status";
import { TrailCoordinates } from "src/app/TrailCoordinates";
import { TrailCoordinatesObj } from "src/app/TrailCoordinatesObj";
import { TrailImportRequest } from "src/app/TrailImportRequest";
import { TrailPreparationModel } from "src/app/TrailPreparationModel";
import { FormUtils } from "src/app/utils/FormUtils";
@Component({
  selector: "app-trail-upload-management",
  templateUrl: "./trail-upload-management.component.html",
  styleUrls: ["./trail-upload-management.component.scss"],
})
export class TrailUploadManagementComponent implements OnInit, OnDestroy {
  tpm: TrailPreparationModel;
  previewCoords: TrailCoordinates[];
  trailFormGroup: FormGroup;
  uploadedSuccesfull: boolean;
  isLoading = false;

  private destroy$ = new Subject();

  constructor(private importService: ImportService, private router: Router) {}

  ngOnInit(): void {
    this.uploadedSuccesfull = false;
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
    this.uploadedSuccesfull = false;
  }

  uploadFile(files: File[]): void {
      this.isLoading = true;
      this.importService
        .readTrail(files[0])
        .pipe(takeUntil(this.destroy$))
        .subscribe((trail) => {
          this.isLoading = false;
          this.uploadedSuccesfull = true;
          this.populateForm(trail);
        });
  }

  uploadFiles(files: FileList): void {
    this.importService
    .readTrails(files)
    .pipe(takeUntil(this.destroy$))
    .subscribe((trail) => {
      this.isLoading = false;
      this.uploadedSuccesfull = true;
      //this.populateForm(trail);
    });
  }

  populateForm(tpm: TrailPreparationModel) {
    this.previewCoords = tpm.coordinates;
    this.trailFormGroup.controls["code"].setValue(tpm.name);
    this.trailFormGroup.controls["description"].setValue(tpm.description);
    this.firstPos.controls["name"].setValue(tpm.startPos.name);
    this.firstPos.controls["latitude"].setValue(
      tpm.startPos.coordinates.latitude
    );
    this.firstPos.controls["longitude"].setValue(
      tpm.startPos.coordinates.longitude
    );
    this.firstPos.controls["altitude"].setValue(
      tpm.startPos.coordinates.altitude
    );
    this.firstPos.controls["distanceFromTrailStart"].setValue(
      tpm.startPos.coordinates.distanceFromTrailStart
    );
    this.finalPos.controls["name"].setValue(tpm.finalPos.name);
    this.finalPos.controls["latitude"].setValue(
      tpm.finalPos.coordinates.latitude
    );
    this.finalPos.controls["longitude"].setValue(
      tpm.finalPos.coordinates.longitude
    );
    this.finalPos.controls["altitude"].setValue(
      tpm.finalPos.coordinates.altitude
    );
    this.finalPos.controls["distanceFromTrailStart"].setValue(
      tpm.finalPos.coordinates.distanceFromTrailStart
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
      this.router.navigate(["/admin/trails", { success: this.tpm.name }]);
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
