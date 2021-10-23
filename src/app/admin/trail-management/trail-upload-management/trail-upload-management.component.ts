import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {
    GeoTrailService,
    Coordinates2D,
    TrailIntersectionResponse, TrailIntersection,
} from "src/app/service/geo-trail-service";
import {ImportService, TrailRawDto, TrailRawResponse} from "src/app/service/import.service";
import {RestResponse} from "src/app/RestResponse";
import {Status} from "src/app/Status";
import {TrailRawService} from "src/app/service/trail-raw-service.service";
import {TrailResponse, FileDetailsDto} from "src/app/service/trail-service.service";
import {TrailImportFormUtils} from "src/app/utils/TrailImportFormUtils";
import {Marker} from "src/app/map-preview/map-preview.component";
import {MapPinIconType} from "src/assets/icons/MapPinIconType";
import * as moment from "moment";
import {AuthService} from "../../../service/auth.service";
import {AdminTrailService} from "../../../service/admin.trail.service";

@Component({
    selector: "app-trail-upload-management",
    templateUrl: "./trail-upload-management.component.html",
    styleUrls: ["./trail-upload-management.component.scss"],
})
export class TrailUploadManagementComponent implements OnInit, OnDestroy {
    trailFormGroup: FormGroup;

    trailRawDto: TrailRawDto;
    otherTrailResponse: TrailResponse;
    intersectionResponse: TrailIntersectionResponse;
    fileDetails: FileDetailsDto;

    isLoading = false;
    isPreviewVisible = false;
    isCrossingSectionComplete = false;
    isError: boolean;

    date: NgbDateStruct;

    closeResult: string;

    testCoordinates: Marker = {
        coords: {
            latitude: 44.11515289941759,
            longitude: 10.814071100111235,
        },
        icon: MapPinIconType.CROSSWAY_ICON
    }

    STEPS = ["Info Generali", "Crocevia", "Località", "Ciclo Escursionismo"];

    CROSSWAY_INDEX = 1;
    STEP_INDEX = 0;

    private destroy$ = new Subject();

    constructor(
        private geoTrailService: GeoTrailService,
        private rawTrailService: TrailRawService,
        private trailImportService: ImportService,
        private adminTrailSaveService: AdminTrailService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private authHelper: AuthService
    ) {
    }

    ngOnInit(): void {

        const currentDate = moment(new Date());

        this.date = {year: currentDate.year(), day: currentDate.date(), month: currentDate.month() + 1}

        this.trailFormGroup = new FormGroup({
            code: new FormControl("", Validators.required),
            officialEta: new FormControl(""),
            name: new FormControl(""),
            classification: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required),
            lastUpdate: new FormControl(""),
            intersections: new FormArray([]),
            maintainingSection: new FormControl(this.authHelper.getSection(), Validators.required),
            startPos: TrailImportFormUtils.getLocationFormGroup(),
            finalPos: TrailImportFormUtils.getLocationFormGroup(),
            locations: new FormArray([]),
            cyclo: TrailImportFormUtils.getCylcloFormGroup(),
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
            this.trailRawDto = response.content[0];
            this.fileDetails = this.trailRawDto.fileDetails;
            this.populateForm(this.trailRawDto);
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onAddLocation(): void {
        this.locations.push(TrailImportFormUtils.getLocationFormGroup());
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

    populateForm(tpm: TrailRawDto) {
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

    // validateAllFormFields(formGroup: FormGroup) {
    //   //{1}
    //   Object.keys(formGroup.controls).forEach((field) => {
    //     //{2}
    //     const control = formGroup.get(field); //{3}
    //     if (control instanceof FormControl) {
    //       //{4}
    //       control.markAsTouched({ onlySelf: true });
    //     } else if (control instanceof FormGroup) {
    //       //{5}
    //       this.validateAllFormFields(control); //{6}
    //     }
    //   });
    // }

    saveTrail() {

        console.log(this.trailFormGroup);
        if (this.trailFormGroup.valid) {
            const trailFormValue = this.trailFormGroup.value;
            const importTrail = TrailImportFormUtils.getImportRequestFromControls(trailFormValue,
                this.trailRawDto.coordinates.map(tc => {
                    return {
                        latitude: tc.latitude,
                        longitude: tc.longitude,
                        altitude: tc.altitude
                    }
                }),
                this.trailRawDto.fileDetails);
            this.trailImportService
              .saveTrail(importTrail)
              .subscribe((response) => this.onSaveRequest(response));
        } else {
            alert("Alcuni campi contengono errori");
        }
    }

    onDetectCrossings() {
        this.toggleLoading();
        let coords = this.trailRawDto.coordinates;
        let coords2d: Coordinates2D[] = coords.map((a) => {
            return {latitude: a.latitude, longitude: a.longitude};
        });
        this.geoTrailService
            .intersect({coordinates: coords2d})
            .subscribe((response) => {
                this.intersectionResponse = response;
                response.content.forEach((intersection: TrailIntersection) => {
                    this.intersections.push(TrailImportFormUtils.getLocationFormGroupFromIntersection(intersection));
                })
                this.isCrossingSectionComplete = true;
                this.toggleLoading();
            });
    }

    toggleLoading() {
        this.isLoading = !this.isLoading;
    }

    open(content) {
        this.modalService
            .open(content, {ariaLabelledBy: "modal-basic-title"})
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
                {success: this.trailRawDto.name},
            ]);
        }
    }

    private onSaveRequest(response: TrailResponse) {
        this.router.navigate(['/admin/trail', { success: response.content[0].code }]);
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

    get intersections() {
        return this.trailFormGroup.controls["intersections"] as FormArray;
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
