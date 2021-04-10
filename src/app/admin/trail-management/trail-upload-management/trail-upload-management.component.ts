import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { GeoTrailService, Coordinates2D, GeoLine } from "src/app/geo-trail-service";
import { ImportService, TrailImportRequest, TrailRaw, TrailRawResponse } from "src/app/import.service";
import { RestResponse } from "src/app/RestResponse";
import { Status } from "src/app/Status";
import { TrailRawService } from "src/app/trail-raw-service.service";
import { TrailCoordinates } from "src/app/trail-service.service";
import { FormUtils } from "src/app/utils/FormUtils";
import { CrossingModalComponent } from "./crossing-modal/crossing-modal.component";
@Component({
  selector: "app-trail-upload-management",
  templateUrl: "./trail-upload-management.component.html",
  styleUrls: ["./trail-upload-management.component.scss"],
})
export class TrailUploadManagementComponent implements OnInit, OnDestroy {

  trailRawResponse: TrailRawResponse;
  trailFormGroup: FormGroup;

  isLoading: boolean;
  isError: boolean;

  public closeResult: string;

  // Section completeness
  public isCrossingSectionComplete: boolean;
  public crossingText: string;

  private destroy$ = new Subject();

  constructor(
    private importService: ImportService,
    private geoTrailService: GeoTrailService,
    private rawTrailService: TrailRawService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isCrossingSectionComplete = false;

    this.crossingText = "Rileva Crocevia";

    this.trailFormGroup = new FormGroup({
      code: new FormControl("", Validators.required),
      eta: new FormControl("", Validators.required),
      name: new FormControl(""),
      classification: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      lastUpdate: new FormControl("", Validators.required),
      maintainingSection: new FormControl("", Validators.required),
      startPos: FormUtils.getLocationFormGroup(),
      finalPos: FormUtils.getLocationFormGroup(),
      locations: new FormArray([]),
    });

    const idFromPath: string = this.route.snapshot.paramMap.get("id");
    this.loadRaw(idFromPath);
  }

  loadRaw(idFromPath: string) {
    this.rawTrailService.getById(idFromPath)
      .subscribe((response) => {
        if (response.content.length == 0) {
          alert("No raw trail found with id " + idFromPath);
          this.isError = true;
          return;
        }
        this.trailRawResponse = response;
        this.isLoading = true;
        this.populateForm(this.trailRawResponse.content[0])
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onAddLocation(): void {
    this.locations.push(FormUtils.getLocationFormGroup());
  }

  onReload(): void {
    this.isLoading = false;
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
      // const trailFormValue = this.trailFormGroup.value;
      // const importTrail = this.getImportRequest(trailFormValue);
      // this.importService
      //   .saveTrail(importTrail)
      //   .subscribe((response) => this.onSaveRequest(response));
    } else {
      alert("Alcuni campi contengono errori");
    }
  }

  onDetectCrossings() {
    let coords = this.trailRawResponse.content[0].coordinates;
    let coords2d: Coordinates2D[] = coords.map(a => { return { latitude: a.latitude, longitude: a.longitude } })
    this.geoTrailService.intersect({ coordinates: coords2d }).subscribe((response) => {
      if (response.content.length == 0) {
        this.isCrossingSectionComplete = true;
        this.crossingText = "Nessun crocevia rilevato"
        return;
      }


    });




  }

  onLoad(restResponse: RestResponse): void {
    if (restResponse.status === Status.OK) {
      this.router.navigate(["/admin/trails", { success: this.trailRawResponse.content[0].name }]);
    }
  }

  private getImportRequest(trailFormValue: any) {
    // const importTrail = trailFormValue as TrailImportRequest;

    // importTrail.lastUpdate = moment(
    //   trailFormValue.lastUpdate.year +
    //     "-" +
    //     trailFormValue.lastUpdate.month +
    //     "-" +
    //     trailFormValue.lastUpdate.day
    // ).toDate().toDateString();
    // let tagsStartPos = trailFormValue.startPos.tags as string;
    // let tagsFinalPos = trailFormValue.finalPos.tags as string;
    // for (var i = 0; i < trailFormValue.locations.length; i++) {
    //   let temp = trailFormValue.locations[i];
    //   importTrail.locations[i].tags =
    //     temp.tags == null ? [] : temp.tags.split(",");
    //   importTrail.locations[i].coordinates = new TrailCoordinatesObj(
    //     temp.latitude,
    //     temp.longitude,
    //     temp.altitude,
    //     temp.distanceFromTrailStart
    //   );
    // }
    // importTrail..tags =
    //   tagsStartPos == null ? [] : tagsStartPos.split(",");
    // importTrail.startPos.coordinates = this.previewCoords[0];
    // importTrail.finalPos.tags =
    //   tagsStartPos == null ? [] : tagsFinalPos.split(",");
    // importTrail.finalPos.coordinates = this.previewCoords[
    //   this.previewCoords.length - 1
    // ];
    // importTrail.coordinates = this.previewCoords;
    // importTrail.name = importTrail.name ? importTrail.name : importTrail.code;
    // return importTrail;
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


