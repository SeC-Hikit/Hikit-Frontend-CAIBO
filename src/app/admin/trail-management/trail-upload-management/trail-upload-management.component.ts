import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import {
  GeoTrailService,
  Coordinates2D,
  TrailIntersectionResponse,
} from "src/app/service/geo-trail-service";
import { TrailRaw, TrailRawResponse } from "src/app/service/import.service";
import { RestResponse } from "src/app/RestResponse";
import { Status } from "src/app/Status";
import { TrailRawService } from "src/app/service/trail-raw-service.service";
import { TrailResponse, FileDetailsDto } from "src/app/service/trail-service.service";
import { FormUtils } from "src/app/utils/FormUtils";
@Component({
  selector: "app-trail-upload-management",
  templateUrl: "./trail-upload-management.component.html",
  styleUrls: ["./trail-upload-management.component.scss"],
})
export class TrailUploadManagementComponent implements OnInit, OnDestroy {
  trailFormGroup: FormGroup;

  trailRawResponse: TrailRawResponse;
  otherTrailResponse: TrailResponse;
  intersectionResponse: TrailIntersectionResponse;
  fileDetails: FileDetailsDto;

  isLoading = false;
  isPreviewVisible = false;
  isCrossingSectionComplete = false;
  isError: boolean;

  closeResult: string;

  testCoordinates: Coordinates2D = {
    latitude: 44.11515289941759,
    longitude: 10.814071100111235,
  };

  STEPS = ["Info Generali", "Crocevia", "Località", "Ciclo Escursionismo"];
  CROSSWAY_INDEX = 1;
  STEP_INDEX = 0;

  private destroy$ = new Subject();

  constructor(
    private geoTrailService: GeoTrailService,
    private rawTrailService: TrailRawService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.trailFormGroup = new FormGroup({
      code: new FormControl("", Validators.required),
      eta: new FormControl("", Validators.required),
      name: new FormControl(""),
      classification: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      lastUpdate: new FormControl("", Validators.required),
      intersectionExample: new FormControl("", Validators.required),
      maintainingSection: new FormControl("", Validators.required),
      startPos: FormUtils.getLocationFormGroup(),
      finalPos: FormUtils.getLocationFormGroup(),
      locations: new FormArray([]),
      cyclo: FormUtils.getCylcloFormGroup(),
    });

    const idFromPath: string = this.route.snapshot.paramMap.get("id");
    this.loadRaw(idFromPath);
  }

  loadRaw(idFromPath: string) {
    this.isLoading = true;
    this.rawTrailService.getById(idFromPath).subscribe((response) => {
      if (response.content.length == 0) {
        alert("No raw trail found with id " + idFromPath);
        this.isError = true;
        return;
      }
      this.trailRawResponse = response;
      this.fileDetails = this.trailRawResponse.content[0].fileDetails;
      this.populateForm(this.trailRawResponse.content[0]);
      this.isLoading = false;
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

  goToNext(): void {
    this.STEP_INDEX++;
    this.scrollUp();

    if (this.STEP_INDEX == this.CROSSWAY_INDEX) {
      this.ensureCheckCrossing();
    }
  }

  private ensureCheckCrossing() {
    if (!this.isCrossingSectionComplete) {
      this.onDetectCrossings();
    }
  }

  goBack(): void {
    this.STEP_INDEX--;
    this.scrollUp();
  }

  scrollUp() {
    window.scrollTo(0, 0);
  }

  populateForm(tpm: TrailRaw) {
    this.trailFormGroup.controls["code"].setValue(tpm.name);
    this.trailFormGroup.controls["description"].setValue(tpm.description);
    this.firstPos.controls["name"].setValue("");
    this.firstPos.controls["latitude"].setValue(tpm.startPos.latitude);
    this.firstPos.controls["longitude"].setValue(tpm.startPos.longitude);
    this.firstPos.controls["altitude"].setValue(tpm.startPos.altitude);
    this.firstPos.controls["distanceFromTrailStart"].setValue(
      tpm.startPos.distanceFromTrailStart
    );
    this.finalPos.controls["name"].setValue("");
    this.finalPos.controls["latitude"].setValue(tpm.finalPos.latitude);
    this.finalPos.controls["longitude"].setValue(tpm.finalPos.longitude);
    this.finalPos.controls["altitude"].setValue(tpm.finalPos.altitude);
    this.finalPos.controls["distanceFromTrailStart"].setValue(
      tpm.finalPos.distanceFromTrailStart
    );
  }

  togglePreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
  }

  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }

  saveTrail() {
    // console.log(this.trailFormGroup.getError());
    // this.validateAllFormFields(this.trailFormGroup);
    // console.log(this.trailFormGroup);

    if (this.trailFormGroup.valid) {
      const trailFormValue = this.trailFormGroup.value;
      // const importTrail = this.getImportRequest(trailFormValue);
      // this.importService
      //   .saveTrail(importTrail)
      //   .subscribe((response) => this.onSaveRequest(response));
    } else {
      alert("Alcuni campi contengono errori");
    }
  }

  onDetectCrossings() {
    this.toggleLoading();
    let coords = this.trailRawResponse.content[0].coordinates;
    let coords2d: Coordinates2D[] = coords.map((a) => {
      return { latitude: a.latitude, longitude: a.longitude };
    });
    this.geoTrailService
      .intersect({ coordinates: coords2d })
      .subscribe((response) => {
        this.intersectionResponse = response;
        this.isCrossingSectionComplete = true;
        this.toggleLoading();
      });
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  onLoad(restResponse: RestResponse): void {
    if (restResponse.status === Status.OK) {
      this.router.navigate([
        "/admin/trails",
        { success: this.trailRawResponse.content[0].name },
      ]);
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
    // // IMPORT ALL LOCATIONS
    // // for (var i = 0; i < trailFormValue.locations.length; i++) {
    // //   let temp = trailFormValue.locations[i];
    // //   importTrail.locations[i].tags =
    // //     temp.tags == null ? [] : temp.tags.split(",");
    // //   importTrail.locations[i].coordinates = new TrailCoordinatesObj(
    // //     temp.latitude,
    // //     temp.longitude,
    // //     temp.altitude,
    // //     temp.distanceFromTrailStart
    // //   );
    // // }
    // importTrail.startLocation.tags =
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

  get cyclo() {
    return this.trailFormGroup.controls["cyclo"] as FormGroup;
  }

  get wayForward() {
    return this.cyclo.controls["wayForward"] as FormGroup;
  }

  get wayBack() {
    return this.cyclo.controls["wayBack"] as FormGroup;
  }

  get cyclo_classification() {
    return this.cyclo["classification"] as FormControl;
  }
}
